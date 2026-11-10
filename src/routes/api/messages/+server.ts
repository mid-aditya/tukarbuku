import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { conversations, messages } from '$lib/server/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { uuid } from '$lib/server/uuid';
import { messageInputSchema } from '$lib/validation/message';

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth();
	if (!session?.user?.id) throw error(401, 'Unauthorized');

	const raw = (await request.json().catch(() => null)) as unknown;
	const parsed = messageInputSchema.safeParse(raw);
	if (!parsed.success) {
		throw error(400, parsed.error.issues[0]?.message ?? 'Input tidak valid');
	}
	const { conversationId, content } = parsed.data;

	const db = getDb();
	const userId = session.user.id;

	// Verify user is a participant.
	const conv = await db
		.select({ id: conversations.id })
		.from(conversations)
		.where(
			and(
				eq(conversations.id, conversationId),
				or(
					eq(conversations.participantOneId, userId),
					eq(conversations.participantTwoId, userId),
				),
			),
		);
	if (!conv.length) throw error(403, 'Forbidden');

	const id = uuid();
	await db.insert(messages).values({
		id,
		conversationId,
		senderId: userId,
		content: content.trim(),
	});

	return json({ id, conversationId, senderId: userId, content: content.trim(), sentAt: new Date().toISOString() });
};
