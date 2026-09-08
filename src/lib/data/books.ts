export type ListingType = 'JUAL' | 'BARTER';
export type Condition = 'Baru' | 'Baik' | 'Cukup' | 'Rusak ringan';

export type Book = {
  id: number;
  title: string;
  author: string;
  condition: Condition;
  listingType: ListingType;
  price?: number;
  wantedInExchange?: string;
  city: string;
  seller: string;
  cover: string;
  accent: string;
};

export const books: Book[] = [
  { id: 1, title: 'Laut Bercerita', author: 'Leila S. Chudori', condition: 'Baik', listingType: 'JUAL', price: 65000, city: 'Bandung', seller: 'Rani A.', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80', accent: 'apricot' },
  { id: 2, title: 'Filosofi Teras', author: 'Henry Manampiring', condition: 'Baik', listingType: 'BARTER', wantedInExchange: 'Buku nonfiksi tentang psikologi', city: 'Jakarta Selatan', seller: 'Dimas K.', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80', accent: 'sage' },
  { id: 3, title: 'The Midnight Library', author: 'Matt Haig', condition: 'Cukup', listingType: 'JUAL', price: 70000, city: 'Surabaya', seller: 'Alya P.', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=700&q=80', accent: 'lilac' },
  { id: 4, title: 'Perempuan yang Menangis kepada Bulan Hitam', author: 'Dian Purnomo', condition: 'Baru', listingType: 'BARTER', wantedInExchange: 'Novel sastra Indonesia lainnya', city: 'Yogyakarta', seller: 'Bagas R.', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=700&q=80', accent: 'sky' },
  { id: 5, title: 'Atomic Habits', author: 'James Clear', condition: 'Baik', listingType: 'JUAL', price: 85000, city: 'Depok', seller: 'Nadia S.', cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80', accent: 'yellow' },
  { id: 6, title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', condition: 'Cukup', listingType: 'BARTER', wantedInExchange: 'Tetralogi Buru volume lain', city: 'Malang', seller: 'Fikri M.', cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=700&q=80', accent: 'rose' },
  { id: 7, title: 'Sapiens', author: 'Yuval Noah Harari', condition: 'Baik', listingType: 'JUAL', price: 90000, city: 'Jakarta Pusat', seller: 'Tia W.', cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=700&q=80', accent: 'mint' },
  { id: 8, title: 'Pulang', author: 'Leila S. Chudori', condition: 'Baik', listingType: 'BARTER', wantedInExchange: 'Kumpulan cerpen Indonesia', city: 'Semarang', seller: 'Rizky N.', cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=700&q=80', accent: 'blue' }
];

export const cities = ['Semua kota', ...Array.from(new Set(books.map((book) => book.city)))];
