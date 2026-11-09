export type ListingType = 'JUAL' | 'BARTER';
export type Condition = 'Baru' | 'Baik' | 'Cukup' | 'Rusak ringan';
export type DbCondition = 'baru' | 'baik' | 'cukup' | 'rusak-ringan';
export type BookStatus = 'tersedia' | 'proses' | 'selesai' | 'dibatalkan';

export const conditionLabels: Record<DbCondition, Condition> = {
	baru: 'Baru',
	baik: 'Baik',
	cukup: 'Cukup',
	'rusak-ringan': 'Rusak ringan'
};

export const conditionValues: Record<Condition, DbCondition> = {
	Baru: 'baru',
	Baik: 'baik',
	Cukup: 'cukup',
	'Rusak ringan': 'rusak-ringan'
};

export const conditionOptions: Condition[] = ['Baru', 'Baik', 'Cukup', 'Rusak ringan'];

export const listingTypeLabels: Record<ListingType, string> = {
	JUAL: 'Dijual',
	BARTER: 'Barter'
};

/** View model yang dipakai semua komponen UI. */
export type Book = {
	id: string;
	title: string;
	author: string;
	condition: Condition;
	listingType: ListingType;
	price?: number | null;
	wantedInExchange?: string | null;
	city: string;
	seller: string;
	sellerId: string;
	cover: string;
	description: string;
	status: BookStatus;
	createdAt: string;
};

export type SortOption = 'terbaru' | 'termurah' | 'termahal';

export const sortLabels: Record<SortOption, string> = {
	terbaru: 'Terbaru',
	termurah: 'Termurah',
	termahal: 'Termahal'
};
