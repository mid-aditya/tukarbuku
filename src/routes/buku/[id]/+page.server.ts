import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getBookById, listBooks } from '$lib/server/books';
import { findOrCreateConversation } from '$lib/server/conversations';

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = await locals.auth();
	let book;
	try {
		book = await getBookById(params.id);
	} catch (err) {
		console.error('[buku] gagal memuat detail buku:', err);
		throw error(503, 'Database sedang tidak tersedia. Coba lagi sebentar lagi.');
	}

	if (!book) throw error(404, 'Buku tidak ditemukan');

	// Rekomendasi: listing lain di kota yang sama.
	let related: Awaited<ReturnType<typeof listBooks>>['items'] = [];
	try {
		const result = await listBooks({ city: book.city, pageSize: 4 });
		related = result.items.filter((item) => item.id !== book.id).slice(0, 3);
	} catch {
		related = [];
	}

	return { book, related, viewerId: session?.user?.id ?? null };
};

export const actions: Actions = {
	/** Masuk ke percakapan dengan pemilik listing ini (dibuat bila belum ada). */
	chat: async ({ params, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) {
			throw redirect(303, `/login?redirectTo=/buku/${params.id}`);
		}

		const book = await getBookById(params.id);
		if (!book) throw error(404, 'Buku tidak ditemukan');
		if (book.sellerId === session.user.id) {
			// Pemilik tidak perlu chat sendiri — arahkan ke kelola listing.
			throw redirect(303, `/dashboard/buku/${params.id}/edit`);
		}

		const conversationId = await findOrCreateConversation({
			userId: session.user.id,
			recipientId: book.sellerId,
			bookId: params.id
		});
		throw redirect(303, `/dashboard/pesanku/${conversationId}`);
	}
};
