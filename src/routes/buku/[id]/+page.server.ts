import { error } from '@sveltejs/kit';
import { books } from '$lib/data/books';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
  const id = Number(params.id);
  const book = Number.isInteger(id) ? books.find((item) => item.id === id) : undefined;

  if (!book) {
    error(404, 'Buku tidak ditemukan');
  }

  return { book };
};
