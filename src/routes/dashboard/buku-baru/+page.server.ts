import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { uuid } from '$lib/server/uuid';
import { getDb } from '$lib/server/db';
import { books, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { bookInputSchema, type ListingFormErrors } from '$lib/validation/book';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.user) throw redirect(303, '/login?redirectTo=/dashboard/buku-baru');

	const db = getDb();
	const [user] = await db
		.select({ city: users.city })
		.from(users)
		.where(eq(users.id, session.user.id))
		.limit(1);

	return { userCity: user?.city ?? null };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) throw redirect(303, '/login?redirectTo=/dashboard/buku-baru');

		const data = await request.formData();
		const priceRaw = String(data.get('price') ?? '').replace(/\D/g, '');

		const parsed = bookInputSchema.safeParse({
			title: data.get('title'),
			author: data.get('author'),
			condition: data.get('condition'),
			description: data.get('description'),
			listingType: data.get('listingType'),
			price: priceRaw ? Number(priceRaw) : null,
			wantedInExchange: data.get('wantedInExchange'),
			city: data.get('city'),
			coverImageUrl: data.get('coverImageUrl')
		});

		if (!parsed.success) {
			const flat = parsed.error.flatten();
			const errors = flat.fieldErrors as ListingFormErrors;
			return fail(422, {
				error: flat.formErrors[0] ?? 'Data buku belum lengkap. Periksa field yang ditandai.',
				errors
			});
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
			price: parsed.data.price ?? null,
			wantedInExchange: parsed.data.wantedInExchange || null,
			city: parsed.data.city,
			coverImageUrl: parsed.data.coverImageUrl,
			status: 'tersedia',
			additionalImageUrls: []
		});

		throw redirect(303, `/buku/${bookId}`);
	}
};
