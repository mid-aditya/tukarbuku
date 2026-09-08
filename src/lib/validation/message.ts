import { z } from 'zod';

export const messageInputSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().trim().min(1).max(2000),
});

export type MessageInput = z.infer<typeof messageInputSchema>;
