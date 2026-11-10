import { z } from 'zod';

export const conversationIdSchema = z.string().uuid();

export const conversationInputSchema = z.object({
  recipientId: z.string().uuid(),
  bookId: z.string().uuid().nullable().optional(),
});

export type ConversationInput = z.infer<typeof conversationInputSchema>;
