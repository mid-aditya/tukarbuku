import type { PageServerLoad } from './$types';
import { books } from '$lib/data/books';

export const load: PageServerLoad = async () => {
	return { books };
};
