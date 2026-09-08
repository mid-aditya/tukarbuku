# Tukarbuku

Platform ringan untuk jual-beli dan barter buku bekas berbasis SvelteKit.

## Stack

- SvelteKit + adapter-node
- PostgreSQL
- Drizzle ORM (tanpa Prisma)
- Zod untuk validasi input server
- Google OAuth untuk autentikasi (tahap berikutnya)
- Cloudflare R2/Supabase Storage untuk gambar (tahap berikutnya)
- WebSocket terpisah untuk chat realtime (tahap berikutnya)

## Local setup

1. Gunakan Node.js LTS.
2. Install dependency dengan lockfile yang akan dibuat oleh package manager pilihan tim.
3. Salin `.env.example` menjadi `.env` dan isi `DATABASE_URL`.
4. Pastikan PostgreSQL berjalan dan database `tukarbuku` sudah dibuat.
5. Jalankan migration:

```sh
npm run db:generate
npm run db:migrate
```

6. Jalankan pemeriksaan dan aplikasi:

```sh
npm run check
npm run dev
```

## Production requirements

Sebelum deploy, konfigurasi wajib berikut harus tersedia di secret manager platform:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `ORIGIN`

Jangan commit `.env`. Gunakan `npm ci` setelah lockfile tersedia, jalankan `npm run check`, `npm run build`, dan audit dependency di CI. Database access hanya boleh di-import dari modul server-only di `src/lib/server`.

## Current status

Landing page publik sudah tersedia menggunakan seed data lokal. Schema Drizzle dan validasi boundary sudah disiapkan. Auth, CRUD listing, storage gambar, transaksi, WebSocket chat, rate limiting, dan observability masih perlu diimplementasikan sebelum production launch.
