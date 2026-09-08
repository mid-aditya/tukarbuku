import { z } from 'zod';

export const bookInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().min(1).max(160),
  condition: z.enum(['baru', 'baik', 'cukup', 'rusak-ringan']),
  description: z.string().trim().min(1).max(5000),
  listingType: z.enum(['JUAL', 'BARTER']),
  price: z.number().int().nonnegative().max(100_000_000).nullable().optional(),
  wantedInExchange: z.string().trim().max(1000).nullable().optional(),
  city: z.string().trim().min(1).max(100),
  area: z.string().trim().max(120).nullable().optional(),
  coverImageUrl: z.string().url().max(2048),
  additionalImageUrls: z.array(z.string().url().max(2048)).max(3).default([]),
}).superRefine((value, context) => {
  if (value.listingType === 'JUAL' && (!value.price || value.price <= 0)) context.addIssue({ code: 'custom', path: ['price'], message: 'Harga wajib diisi untuk buku yang dijual.' });
  if (value.listingType === 'BARTER' && !value.wantedInExchange) context.addIssue({ code: 'custom', path: ['wantedInExchange'], message: 'Deskripsi buku barter wajib diisi.' });
});

export type BookInput = z.infer<typeof bookInputSchema>;
