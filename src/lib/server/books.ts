import { and, count, desc, eq, ilike, inArray, isNull, ne, or, sql } from 'drizzle-orm';
import { getDb } from './db';
import { books, conversations, messages, transactions, users } from './db/schema';
import {
	conditionLabels,
	type Book,
	type DbCondition,
	type ListingType,
	type SortOption
} from '$lib/data/books';

export const bookColumns = {
	id: books.id,
	title: books.title,
	author: books.author,
	condition: books.condition,
	description: books.description,
	coverImageUrl: books.coverImageUrl,
	listingType: books.listingType,
	price: books.price,
	wantedInExchange: books.wantedInExchange,
	city: books.city,
	area: books.area,
	status: books.status,
	createdAt: books.createdAt,
	ownerId: books.ownerId,
	ownerName: users.name
};

export type BookRow = {
	id: string;
	title: string;
	author: string;
	condition: DbCondition;
	description: string;
	coverImageUrl: string;
	listingType: 'JUAL' | 'BARTER' | 'DONASI';
	price: number | null;
	wantedInExchange: string | null;
	city: string;
	area: string | null;
	status: Book['status'];
	createdAt: Date;
	ownerId: string;
	ownerName: string | null;
};

export function mapBook(row: BookRow): Book {
	return {
		id: row.id,
		title: row.title,
		author: row.author,
		condition: conditionLabels[row.condition] ?? 'Baik',
		listingType: row.listingType === 'BARTER' ? 'BARTER' : 'JUAL',
		price: row.price,
		wantedInExchange: row.wantedInExchange,
		city: row.city,
		seller: row.ownerName ?? 'Pembaca',
		sellerId: row.ownerId,
		cover: row.coverImageUrl,
		description: row.description,
		status: row.status,
		createdAt: row.createdAt.toISOString()
	};
}

export type BookFilters = {
	q?: string;
	type?: ListingType;
	condition?: DbCondition;
	city?: string;
	sort?: SortOption;
	page?: number;
	pageSize?: number;
};

const MAX_PAGE_SIZE = 48;

function buildWhere(filters: BookFilters) {
	const clauses = [
		eq(books.status, 'tersedia'),
		inArray(books.listingType, ['JUAL', 'BARTER'])
	];

	if (filters.q) {
		const term = `%${filters.q}%`;
		const match = or(ilike(books.title, term), ilike(books.author, term));
		if (match) clauses.push(match);
	}
	if (filters.type) clauses.push(eq(books.listingType, filters.type));
	if (filters.condition) clauses.push(eq(books.condition, filters.condition));
	if (filters.city) clauses.push(eq(books.city, filters.city));

	return and(...clauses);
}

function orderBy(sort: SortOption | undefined) {
	if (sort === 'termurah') return sql`${books.price} asc nulls last`;
	if (sort === 'termahal') return sql`${books.price} desc nulls last`;
	return desc(books.createdAt);
}

export async function listBooks(filters: BookFilters = {}): Promise<{ items: Book[]; total: number }> {
	const db = getDb();
	const page = Math.max(1, filters.page ?? 1);
	const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, filters.pageSize ?? 9));
	const where = buildWhere(filters);

	const [rows, totals] = await Promise.all([
		db
			.select(bookColumns)
			.from(books)
			.innerJoin(users, eq(users.id, books.ownerId))
			.where(where)
			.orderBy(orderBy(filters.sort))
			.limit(pageSize)
			.offset((page - 1) * pageSize),
		db.select({ value: count() }).from(books).where(where)
	]);

	return { items: rows.map(mapBook), total: Number(totals[0]?.value ?? 0) };
}

export async function getBookById(id: string): Promise<Book | null> {
	const db = getDb();
	const rows = await db
		.select(bookColumns)
		.from(books)
		.innerJoin(users, eq(users.id, books.ownerId))
		.where(eq(books.id, id))
		.limit(1);

	return rows.length ? mapBook(rows[0]) : null;
}

export async function listCities(): Promise<string[]> {
	const db = getDb();
	const rows = await db
		.selectDistinct({ city: books.city })
		.from(books)
		.where(and(eq(books.status, 'tersedia'), inArray(books.listingType, ['JUAL', 'BARTER'])))
		.orderBy(books.city);

	return rows.map((row) => row.city);
}

export type DashboardSummary = {
	activeListings: number;
	pendingOffers: number;
	unreadMessages: number;
	recentListings: Book[];
};

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
	const db = getDb();

	const [listingCount, offerCount, unreadCount, recentRows] = await Promise.all([
		db
			.select({ value: count() })
			.from(books)
			.where(and(eq(books.ownerId, userId), eq(books.status, 'tersedia'))),
		db
			.select({ value: count() })
			.from(transactions)
			.where(and(eq(transactions.sellerId, userId), eq(transactions.status, 'pending'))),
		db
			.select({ value: count() })
			.from(messages)
			.innerJoin(conversations, eq(conversations.id, messages.conversationId))
			.where(
				and(
					ne(messages.senderId, userId),
					isNull(messages.readAt),
					or(
						eq(conversations.participantOneId, userId),
						eq(conversations.participantTwoId, userId)
					)
				)
			),
		db
			.select(bookColumns)
			.from(books)
			.innerJoin(users, eq(users.id, books.ownerId))
			.where(and(eq(books.ownerId, userId), eq(books.status, 'tersedia')))
			.orderBy(desc(books.createdAt))
			.limit(5)
	]);

	return {
		activeListings: Number(listingCount[0]?.value ?? 0),
		pendingOffers: Number(offerCount[0]?.value ?? 0),
		unreadMessages: Number(unreadCount[0]?.value ?? 0),
		recentListings: recentRows.map(mapBook)
	};
}
