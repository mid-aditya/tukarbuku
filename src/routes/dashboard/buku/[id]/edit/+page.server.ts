import { error, redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { books } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { bookInputSchema, type ListingFormErrors } from '$lib/validation/book';

function parseListingForm(data: FormData) {
	const priceRaw = String(data.get('price') ?? '').replace(/\D/g, '');
	return bookInputSchema.safeParse({
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
}

const notFound = () => error(404, 'Listing tidak ditemukan di akunmu.');

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = await locals.auth();
	const redirectTo = `/login?redirectTo=/dashboard/buku/${params.id}/edit`;
	if (!session?.user) throw redirect(303, redirectTo);

	const db = getDb();
	let book: typeof books.$inferSelect | undefined;
	try {
		[book] = await db
			.select()
			.from(books)
			.where(and(eq(books.id, params.id), eq(books.ownerId, session.user.id)))
			.limit(1);
	} catch (err) {
		console.error('[edit listing] gagal memuat buku:', err);
		throw error(503, 'Database sedang tidak tersedia. Coba lagi sebentar lagi.');
	}

	if (!book) notFound();

	return { book };
};

export const actions: Actions = {
	update: async ({ request, locals, params }) => {
		const session = await locals.auth();
		if (!session?.user?.id) throw redirect(303, '/login');

		const parsed = parseListingForm(await request.formData());
		if (!parsed.success) {
			const flat = parsed.error.flatten();
			return fail(422, {
				error: flat.formErrors[0] ?? 'Data buku belum lengkap. Periksa field yang ditandai.',
				errors: flat.fieldErrors as ListingFormErrors
			});
		}

		const db = getDb();
		const updated = await db
			.update(books)
			.set({
				title: parsed.data.title,
				author: parsed.data.author,
				condition: parsed.data.condition,
				description: parsed.data.description,
				listingType: parsed.data.listingType,
				price: parsed.data.price ?? null,
				wantedInExchange: parsed.data.wantedInExchange || null,
				city: parsed.data.city,
				coverImageUrl: parsed.data.coverImageUrl,
				updatedAt: new Date()
			})
			.where(and(eq(books.id, params.id), eq(books.ownerId, session.user.id)))
			.returning({ id: books.id });

		if (!updated.length) notFound();

		throw redirect(303, `/buku/${params.id}`);
	},
	delete: async ({ params, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) throw redirect(303, '/login');

		const db = getDb();
		let deleted;
		try {
			deleted = await db
				.delete(books)
				.where(and(eq(books.id, params.id), eq(books.ownerId, session.user.id)))
				.returning({ id: books.id });
		} catch (err) {
			// 23503: FK restrict dari tabel transaksi — listing pernah dipakai transaksi.
			if (err instanceof Error && 'code' in err && (err as { code?: string }).code === '23503') {
				return fail(400, {
					deleteError:
						'Listing tidak bisa dihapus karena pernah dipakai dalam transaksi. Tandai transaksinya selesai lewat chat, lalu hapus lagi.'
				});
			}
			throw err;
		}

		if (!deleted.length) notFound();

		throw redirect(303, '/dashboard');
	}
};
