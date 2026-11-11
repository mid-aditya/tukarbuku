# Tukarbuku

Platform ringan untuk jual-beli dan barter buku bekas berbasis SvelteKit.

## Stack

- SvelteKit + adapter-node, Socket.IO di proses yang sama (`server.js`) untuk chat realtime
- PostgreSQL + Drizzle ORM
- Zod untuk validasi input server
- Auth.js Google OAuth untuk autentikasi
- URL gambar eksternal (upload ke object storage masih tahap berikutnya)

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

## Production

```sh
npm run build
node --env-file=.env server.js
```

`server.js` membungkus handler SvelteKit adapter-node dan Socket.IO untuk chat realtime; koneksi socket diotentikasi lewat cookie sesi Auth.js di handshake. Catatan: rate limiter chat in-memory, jadi server mengasumsikan satu instance.

## Production requirements

Sebelum deploy, konfigurasi wajib berikut harus tersedia di secret manager platform:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `ORIGIN`

Jangan commit `.env`. Gunakan `npm ci` setelah lockfile tersedia, jalankan `npm run check`, `npm run build`, dan audit dependency di CI. Database access hanya boleh di-import dari modul server-only di `src/lib/server`.

## Current status

Fitur inti sudah jalan: landing + koleksi dari database, detail buku, favorit, Google OAuth dengan setup profil, dashboard, buat/edit/hapus listing, chat realtime persisten dengan pesan belum-dibaca, sitemap/robots/meta sosial, validasi zod, dan rate limiting. Yang belum, sebelum production launch: transaksi (schema sudah ada, alurnya belum), upload gambar ke object storage, dan observability.
