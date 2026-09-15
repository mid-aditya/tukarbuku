/**
 * Custom production server — wraps the SvelteKit Node handler with Socket.IO.
 *
 * Usage (production):
 *   node server.js
 *
 * Development uses `npm run dev` (Vite dev server) which does NOT support Socket.IO
 * in this setup. For development with real-time chat, use `npm run dev:socket` separately.
 */

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIO } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME ?? 'localhost';
const port = parseInt(process.env.PORT ?? '3000', 10);

// Lazy-load SvelteKit handler so it is only instantiated after env is ready.
let handler;
const app = next({ dev, hostname, quiet: false });
const prepare = app.prepare();

async function getHandler() {
	if (!handler) {
		await prepare;
		// Dynamic import so env vars are read at runtime.
		const mod = await import('./build/handler.js');
		handler = mod.handler;
	}
	return handler;
}

const httpServer = createServer(async (req, res) => {
	try {
		const parsedUrl = parse(req.url, true);
		const h = await getHandler();
		await h(req, res, parsedUrl);
	} catch (err) {
		console.error('Server error:', err);
		res.statusCode = 500;
		res.end('Internal server error');
	}
});

const io = new SocketIO(httpServer, {
	cors: {
		origin: process.env.ORIGIN ?? `http://localhost:${port}`,
		methods: ['GET', 'POST'],
		credentials: true,
	},
});

// ── In-memory presence map (pid → Set of socket ids) ──────────────────────
// In production this should be replaced with Redis or a DB-backed store.
const presence = new Map(); // userId → Set<socketId>

io.on('connection', (socket) => {
	const userId = socket.handshake.auth?.userId;
	if (!userId) {
		socket.disconnect();
		return;
	}

	// Track presence.
	if (!presence.has(userId)) presence.set(userId, new Set());
	presence.get(userId).add(socket.id);

	console.log(`[socket] user ${userId} connected (socket ${socket.id})`);

	// Join per-conversation room so we can broadcast to all participants.
	socket.on('join:conversation', (conversationId) => {
		socket.join(`conversation:${conversationId}`);
		console.log(`[socket] socket ${socket.id} joined room conversation:${conversationId}`);
	});

	socket.on('leave:conversation', (conversationId) => {
		socket.leave(`conversation:${conversationId}`);
	});

	socket.on('message:send', (payload) => {
		// payload: { conversationId, content, tempId }
		// Broadcast to everyone in the room INCLUDING sender (for confirmation + timestamp).
		io.to(`conversation:${payload.conversationId}`).emit('message:new', {
			...payload,
			senderId: userId,
			sentAt: new Date().toISOString(),
		});
	});

	socket.on('disconnect', () => {
		const set = presence.get(userId);
		if (set) {
			set.delete(socket.id);
			if (!set.size) presence.delete(userId);
		}
		console.log(`[socket] user ${userId} disconnected (socket ${socket.id})`);
	});
});

httpServer
	.once('error', (err) => {
		console.error(err);
		process.exit(1);
	})
	.listen(port, () => {
		console.log(`> Tukarbuku ready on http://${hostname}:${port}`);
	});
