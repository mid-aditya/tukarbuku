import { redirect, fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { uuid } from '$lib/server/uuid';
import { getDb } from '$lib/server/db';
import { books } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.user) throw redirect(303, '/login?redirectTo=/dashboard/buku-baru');
	return {};
};

const createBookSchema = z.object({
	title: z.string().trim().min(1).max(200),
	author: z.string().trim().min(1).max(160),
	condition: z.enum(['baru', 'baik', 'cukup', 'rusak-ringan']),
	description: z.string().trim().min(1).max(5000),
	listingType: z.enum(['JUAL', 'BARTER']),
	price: z.string().trim().optional(),
	wantedInExchange: z.string().trim().max(1000).optional(),
	city: z.string().trim().min(1).max(100),
	coverImageUrl: z.string().trim().url().max(2048),
});

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) throw redirect(303, '/login?redirectTo=/dashboard/buku-baru');

		const data = await request.formData();
		const raw = {
			title: data.get('title'),
			author: data.get('author'),
			condition: data.get('condition'),
			description: data.get('description'),
			listingType: data.get('listingType'),
			price: data.get('price') || undefined,
			wantedInExchange: data.get('wantedInExchange') || undefined,
			city: data.get('city'),
			coverImageUrl: data.get('coverImageUrl'),
		};

		const parsed = createBookSchema.safeParse(raw);
		if (!parsed.success) {
			return fail(422, { error: 'Data buku tidak valid. Pastikan semua field wajib terisi.' });
		}

		const { price, wantedInExchange, ...rest } = parsed.data;
		const priceNum = parsed.data.listingType === 'JUAL' && price ? parseInt(price, 10) : null;

		if (parsed.data.listingType === 'JUAL' && (!price || isNaN(priceNum!))) {
			return fail(422, { error: 'Harga wajib diisi untuk buku yang dijual.' });
		}
		if (parsed.data.listingType === 'BARTER' && !wantedInExchange) {
			return fail(422, { error: 'Deskripsi buku yang diinginkan wajib diisi untuk barter.' });
		}

		const db = getDb();
		const bookId = uuid();

		await db.insert(books).values({
			id: bookId,
			ownerId: session.user.id,
			title: parsed.data.title,
			author: parsed.data.author,
			condition: parsed.data.condition,
			description: parsed.data.description,
			listingType: parsed.data.listingType,
			price: priceNum,
			wantedInExchange: wantedInExchange ?? null,
			city: parsed.data.city,
			coverImageUrl: parsed.data.coverImageUrl,
			status: 'tersedia',
			additionalImageUrls: [],
		});

		throw redirect(303, `/buku/${bookId}`);
	},
};
