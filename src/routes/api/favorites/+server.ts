import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBookById } from '$lib/server/books';
import { listFavoriteIds, toggleFavorite } from '$lib/server/favorites';
import { favoriteToggleInputSchema } from '$lib/validation/favorite';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.user?.id) throw error(401, 'Unauthorized');

	return json({ ids: await listFavoriteIds(session.user.id) });
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth();
	if (!session?.user?.id) throw error(401, 'Unauthorized');

	const raw = (await request.json().catch(() => null)) as unknown;
	const parsed = favoriteToggleInputSchema.safeParse(raw);
	if (!parsed.success) {
		throw error(400, parsed.error.issues[0]?.message ?? 'Input tidak valid');
	}
	const { bookId } = parsed.data;

	const book = await getBookById(bookId);
	if (!book) throw error(404, 'Buku tidak ditemukan');

	const favorited = await toggleFavorite(session.user.id, bookId);
	return json({ favorited });
};
