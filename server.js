/**
 * Custom production server — wraps the SvelteKit Node handler (adapter-node)
 * with a Socket.IO layer for realtime chat.
 *
 * Design decisions (documented trade-off, single-instance deployment):
 * - Socket.IO is a READ/notify path only. Messages are always persisted
 *   through the REST endpoint `POST /api/messages` (validated + rate-limited),
 *   which then broadcasts `message:new` via the `io` instance exposed on
 *   `globalThis.__socketio` below.
 * - Auth happens at socket handshake: the Auth.js JWT session cookie is
 *   decoded with `decode({ secret, salt })` where `salt` is the session
 *   cookie name (that is how Auth.js derives the key).
 * - `join:conversation` only joins the room after checking the user is a
 *   participant in the DB — you cannot subscribe to someone else's chat.
 * - `message:read` marks unread rows in the DB and notifies the room.
 * - The rate limiter used by the REST write path is in-memory, so this
 *   server assumes a single instance (add Redis adapter before scaling out).
 *
 * Usage (production):
 *   npm run build && node server.js
 *
 * `npm run dev` (Vite) has no Socket.IO layer; the chat client falls back to
 * REST polling in that case.
 */

import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import { decode } from '@auth/core/jwt';
import postgres from 'postgres';

const hostname = process.env.HOSTNAME ?? 'localhost';
const port = parseInt(process.env.PORT ?? '3000', 10);
const origin = process.env.ORIGIN ?? `http://localhost:${port}`;

const sql = process.env.DATABASE_URL
	? postgres(process.env.DATABASE_URL, { prepare: false, max: 5 })
	: null;
if (!sql) console.warn('[server] DATABASE_URL tidak diset — socket chat tidak akan berfungsi.');

let handlerPromise;
function getHandler() {
	handlerPromise ??= import('./build/handler.js').then((mod) => mod.handler);
	return handlerPromise;
}

const httpServer = createServer(async (req, res) => {
	try {
		const handler = await getHandler();
		handler(req, res);
	} catch (err) {
		console.error('Server error:', err);
		if (!res.headersSent) res.statusCode = 500;
		res.end('Internal server error');
	}
});

const io = new SocketIO(httpServer, {
	cors: {
		origin: origin,
		methods: ['GET', 'POST'],
		credentials: true,
	},
});

// SvelteKit handlers (running through Vite/adapter) broadcast to rooms via this.
globalThis.__socketio = io;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SESSION_COOKIE_INSECURE = 'authjs.session-token';
const SESSION_COOKIE_SECURE = `__Secure-${SESSION_COOKIE_INSECURE}`;

function parseCookies(header) {
	const cookies = {};
	if (!header) return cookies;
	for (const part of header.split(';')) {
		const idx = part.indexOf('=');
		if (idx === -1) continue;
		cookies[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
	}
	return cookies;
}

/** Decode the Auth.js JWT session cookie from the socket handshake. */
async function getHandshakeUserId(socket) {
	const cookies = parseCookies(socket.handshake.headers.cookie);
	const name = SESSION_COOKIE_SECURE in cookies ? SESSION_COOKIE_SECURE : SESSION_COOKIE_INSECURE;
	const token = cookies[name];
	const secret = process.env.AUTH_SECRET;
	if (!token || !secret) return null;
	try {
		const session = await decode({ secret, salt: name, token });
		return typeof session?.userId === 'string' ? session.userId : null;
	} catch {
		return null;
	}
}

// Reject unauthenticated connections during the handshake itself: the client
// receives a proper connect_error instead of a connect followed by a kick,
// and socket.data.userId is guaranteed populated before any event can arrive.
io.use(async (socket, next) => {
	const userId = await getHandshakeUserId(socket);
	if (!userId) {
		next(new Error('Sesi tidak valid. Muat ulang halaman untuk login ulang.'));
		return;
	}
	socket.data.userId = userId;
	next();
});

/** Verify the user actually participates in the conversation before joining. */
function isParticipant(conversationId, userId) {
	if (typeof userId !== 'string' || !UUID_RE.test(conversationId)) return Promise.resolve(false);
	return sql`
		select 1 from conversations
		where id = ${conversationId}
		  and (participant_one_id = ${userId} or participant_two_id = ${userId})
		limit 1
	`.then((rows) => rows.length > 0);
}

io.on('connection', (socket) => {
	const userId = socket.data.userId;
	// Room per user: lets the server notify someone about new/unread
	// conversations without knowing which chat they have open.
	socket.join(`user:${userId}`);
	console.log(`[socket] user ${userId.slice(0, 8)}… connected (${socket.id})`);

	socket.on('join:conversation', async (conversationId, ack) => {
		if (!userId) return ack?.({ ok: false, reason: 'unauthorized' });
		if (!sql) return ack?.({ ok: false, reason: 'unavailable' });
		if (typeof conversationId !== 'string' || !UUID_RE.test(conversationId)) {
			return ack?.({ ok: false, reason: 'invalid' });
		}
		if (!(await isParticipant(conversationId, userId))) {
			return ack?.({ ok: false, reason: 'forbidden' });
		}
		socket.join(`conversation:${conversationId}`);
		ack?.({ ok: true });
	});

	socket.on('leave:conversation', (conversationId) => {
		if (typeof conversationId === 'string' && UUID_RE.test(conversationId)) {
			socket.leave(`conversation:${conversationId}`);
		}
	});

	// Mark all of the OTHER participant's unread messages as read, then let the
	// sender's client update its read state. Payload shape:
	// { conversationId, readerId, messageIds, readAt }
	socket.on('message:read', async (conversationId, ack) => {
		if (!userId) return ack?.({ ok: false, reason: 'unauthorized' });
		if (!sql) return ack?.({ ok: false, reason: 'unavailable' });
		if (typeof conversationId !== 'string' || !UUID_RE.test(conversationId)) {
			return ack?.({ ok: false, reason: 'invalid' });
		}
		if (!(await isParticipant(conversationId, userId))) {
			return ack?.({ ok: false, reason: 'forbidden' });
		}
		const readAt = new Date().toISOString();
		const updated = await sql`
			update messages set read_at = ${readAt}
			where conversation_id = ${conversationId}
			  and sender_id <> ${userId}
			  and read_at is null
			returning id
		`;
		if (updated.length) {
			io.to(`conversation:${conversationId}`).emit('message:read', {
				conversationId,
				readerId: userId,
				messageIds: updated.map((row) => row.id),
				readAt,
			});
		}
		ack?.({ ok: true, count: updated.length });
	});

	socket.on('disconnect', () => {
		if (userId) console.log(`[socket] user ${userId.slice(0, 8)}… disconnected (${socket.id})`);
	});
});

httpServer
	.once('error', (err) => {
		console.error(err);
		process.exit(1);
	})
	.listen(port, () => {
		console.log(`> Tukarbuku ready on http://${hostname}:${port}`);
		for (const signal of ['SIGINT', 'SIGTERM']) {
			process.on(signal, () => {
				io.close();
				httpServer.close();
				sql?.end({ timeout: 5 });
			});
		}
	});
