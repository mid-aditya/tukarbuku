import { z } from 'zod';

export const favoriteToggleInputSchema = z.object({
  bookId: z.string().uuid(),
});

export type FavoriteToggleInput = z.infer<typeof favoriteToggleInputSchema>;
