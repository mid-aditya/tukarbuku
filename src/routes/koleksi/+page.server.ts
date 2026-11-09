import type { PageServerLoad } from './$types';
import { conditionLabels, conditionValues, sortLabels, type Condition, type SortOption } from '$lib/data/books';
import { listBooks, listCities } from '$lib/server/books';

const PAGE_SIZE = 9;

function parseCondition(raw: string | null) {
	if (!raw || !(raw in conditionValues)) return undefined;
	return conditionValues[raw as Condition];
}

function parseType(raw: string | null) {
	return raw === 'JUAL' || raw === 'BARTER' ? raw : undefined;
}

function parseSort(raw: string | null): SortOption {
	return raw && raw in sortLabels ? (raw as SortOption) : 'terbaru';
}

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	const type = parseType(url.searchParams.get('type'));
	const conditionLabel = url.searchParams.get('kondisi');
	const condition = parseCondition(conditionLabel);
	const city = url.searchParams.get('kota')?.trim() ?? '';
	const sort = parseSort(url.searchParams.get('sort'));
	const requestedPage = Number(url.searchParams.get('page') ?? '1');
	const page = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;

	const filters = {
		q,
		type,
		condition: (conditionLabel && condition ? conditionLabel : '') as Condition | '',
		city,
		sort,
		page
	};

	try {
		const [result, cities] = await Promise.all([
			listBooks({ q, type, condition, city: city || undefined, sort, page, pageSize: PAGE_SIZE }),
			listCities()
		]);

		return {
			books: result.items,
			total: result.total,
			pageSize: PAGE_SIZE,
			cities,
			filters,
			dbAvailable: true,
			conditionOptions: Object.values(conditionLabels)
		};
	} catch (err) {
		console.error('[koleksi] gagal memuat buku dari database:', err);
		return {
			books: [],
			total: 0,
			pageSize: PAGE_SIZE,
			cities: [],
			filters,
			dbAvailable: false,
			conditionOptions: Object.values(conditionLabels)
		};
	}
};
