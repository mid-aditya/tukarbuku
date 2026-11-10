import type { RequestHandler } from './$types';
import { listBooks } from '$lib/server/books';

const STATIC_PATHS = ['/', '/koleksi', '/cara-kerja'];
const MAX_SITEMAP_PAGES = 10;
const PAGE_SIZE = 48;

function escapeXml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET: RequestHandler = async ({ url }) => {
	const origin = url.origin;
	const entries: { loc: string; lastmod?: string }[] = STATIC_PATHS.map((path) => ({
		loc: `${origin}${path}`
	}));

	try {
		for (let page = 1; page <= MAX_SITEMAP_PAGES; page++) {
			const { items, total } = await listBooks({ page, pageSize: PAGE_SIZE });
			for (const book of items) {
				entries.push({ loc: `${origin}/buku/${book.id}`, lastmod: book.createdAt });
			}
			if (page * PAGE_SIZE >= total) break;
		}
	} catch (err) {
		// Sitemap should still render with static URLs when the DB is down.
		console.error('[sitemap] gagal memuat listing buku:', err);
	}

	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries.map((entry) =>
			[
				'\t<url>',
				`\t\t<loc>${escapeXml(entry.loc)}</loc>`,
				entry.lastmod ? `\t\t<lastmod>${new Date(entry.lastmod).toISOString()}</lastmod>` : null,
				'\t</url>'
			]
				.filter(Boolean)
				.join('\n')
		),
		'</urlset>',
		''
	].join('\n');

	return new Response(xml, {
		headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'max-age=3600' }
	});
};
