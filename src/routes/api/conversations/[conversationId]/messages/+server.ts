import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { conversations, messages, users } from '$lib/server/db/schema';
import { eq, and, or, asc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals, params }) => {
	const session = await locals.auth();
	if (!session?.user?.id) throw error(401, 'Unauthorized');

	const db = getDb();
	const userId = session.user.id;
	const conversationId = params.conversationId;

	// Verify user is a participant in this conversation.
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

	const rows = await db
		.select({
			id: messages.id,
			conversationId: messages.conversationId,
			senderId: messages.senderId,
			content: messages.content,
			sentAt: messages.sentAt,
			readAt: messages.readAt,
			senderName: users.name,
		})
		.from(messages)
		.leftJoin(users, eq(messages.senderId, users.id))
		.where(eq(messages.conversationId, conversationId))
		.orderBy(asc(messages.sentAt));

	return json(rows);
};
