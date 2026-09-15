/**
 * Seed script — populates the database with sample users and book listings.
 * Run after migration:
 *
 *   npx tsx scripts/seed.ts
 *
 * Safe to re-run: checks for existing data before inserting.
 */

import 'dotenv/config';
import { uuid } from '../src/lib/server/uuid';
import { getDb } from '../src/lib/server/db';
import { users, books } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
	const db = getDb();

	// ── Sample users ────────────────────────────────────────────────────────
	const sampleUsers = [
		{ googleId: 'google|rania', email: 'rani@example.com', name: 'Rani A.', city: 'Bandung', phone: null },
		{ googleId: 'google|dimasw', email: 'dimas@example.com', name: 'Dimas K.', city: 'Jakarta Selatan', phone: null },
		{ googleId: 'google|alyap', email: 'alya@example.com', name: 'Alya P.', city: 'Surabaya', phone: null },
		{ googleId: 'google|bagasr', email: 'bagas@example.com', name: 'Bagas R.', city: 'Yogyakarta', phone: null },
		{ googleId: 'google|nadias', email: 'nadia@example.com', name: 'Nadia S.', city: 'Depok', phone: null },
		{ googleId: 'google|fikrim', email: 'fikri@example.com', name: 'Fikri M.', city: 'Malang', phone: null },
		{ googleId: 'google|tiawp', email: 'tia@example.com', name: 'Tia W.', city: 'Jakarta Pusat', phone: null },
		{ googleId: 'google|rizkyn', email: 'rizky@example.com', name: 'Rizky N.', city: 'Semarang', phone: null },
	];

	const userIds: string[] = [];

	for (const u of sampleUsers) {
		const existing = await db.select({ id: users.id }).from(users).where(eq(users.googleId, u.googleId));
		if (existing.length) {
			console.log(`  user "${u.name}" already exists — skipping`);
			userIds.push(existing[0].id);
		} else {
			const id = uuid();
			await db.insert(users).values({ id, googleId: u.googleId, email: u.email, name: u.name, city: u.city, phone: u.phone, profileCompleted: true });
			console.log(`  created user: ${u.name}`);
			userIds.push(id);
		}
	}

	// ── Sample books ────────────────────────────────────────────────────────
	const [raniId, dimasId, alyaId, bagasId, nadiaId, fikriId, tiaId, rizkyId] = userIds;

	const sampleBooks = [
		{ ownerId: raniId, title: 'Laut Bercerita', author: 'Leila S. Chudori', condition: 'baik' as const, description: 'Buku dalam kondisi baik, sampul utuh tanpa robekan. Beberapa halaman ada bekas stabilo tipis di margins, tapi tidak mengganggu membaca.', listingType: 'JUAL' as const, price: 65000, city: 'Bandung', coverImageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80' },
		{ ownerId: dimasId, title: 'Filosofi Teras', author: 'Henry Manampiring', condition: 'baik' as const, description: 'Kondisi sangat baik. Pernah dibaca dua kali tapi buku tetap bersih dan tidak ada catatan.', listingType: 'BARTER' as const, wantedInExchange: 'Buku nonfiksi tentang psikologi atau filsafat Stoik', city: 'Jakarta Selatan', coverImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80' },
		{ ownerId: alyaId, title: 'The Midnight Library', author: 'Matt Haig', condition: 'cukup' as const, description: 'Sampul sedikit kusut di sudut. Beberapa halaman ada coretan pensil yang masih bisa dihapus. Siap dibaca.', listingType: 'JUAL' as const, price: 70000, city: 'Surabaya', coverImageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=700&q=80' },
		{ ownerId: bagasId, title: 'Perempuan yang Menangis kepada Bulan Hitam', author: 'Dian Purnomo', condition: 'baru' as const, description: 'Masih plastic wrap belum dibuka. Beli tapi belum sempat dibaca.', listingType: 'BARTER' as const, wantedInExchange: 'Novel sastra Indonesia lainnya', city: 'Yogyakarta', coverImageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=700&q=80' },
		{ ownerId: nadiaId, title: 'Atomic Habits', author: 'James Clear', condition: 'baik' as const, description: 'Kondisi prima. Tidak ada catatan, tidak ada robekan. Buku favorit tapi sudah selesai diterapkan.', listingType: 'JUAL' as const, price: 85000, city: 'Depok', coverImageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80' },
		{ ownerId: fikriId, title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', condition: 'cukup' as const, description: 'Sampul lusuh dan beberapa halaman ada sedikit noda. Isi masih lengkap dan bisa dibaca.', listingType: 'BARTER' as const, wantedInExchange: 'Tetralogi Buru volume lain (Jangan Sentuh Aku, Anak Semua Bangsa, Rumah Kaca)', city: 'Malang', coverImageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=700&q=80' },
		{ ownerId: tiaId, title: 'Sapiens', author: 'Yuval Noah Harari', condition: 'baik' as const, description: 'Kondisi sangat baik. Pembacaan intensif tapi tidak ada catatan atau kerusakan.', listingType: 'JUAL' as const, price: 90000, city: 'Jakarta Pusat', coverImageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=700&q=80' },
		{ ownerId: rizkyId, title: 'Pulang', author: 'Leila S. Chudori', condition: 'baik' as const, description: 'Buku dalam kondisi baik. Sampul sedikit menguning di tepi karena usia.', listingType: 'BARTER' as const, wantedInExchange: 'Kumpulan cerpen Indonesia (Eka Kurniawan, Leila S. Chudori, atau penulis lain)', city: 'Semarang', coverImageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=700&q=80' },
	];

	for (const b of sampleBooks) {
		const existing = await db
			.select({ id: books.id })
			.from(books)
			.where(eq(books.title, b.title));
		if (existing.length) {
			console.log(`  book "${b.title}" already exists — skipping`);
		} else {
			await db.insert(books).values({ id: uuid(), ...b, status: 'tersedia', additionalImageUrls: [] });
			console.log(`  created book: ${b.title}`);
		}
	}

	console.log('\nSeed complete.');
}

main().catch((err) => {
	console.error('Seed failed:', err);
	process.exit(1);
});
