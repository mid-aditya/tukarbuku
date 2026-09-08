<script lang="ts">
  import type { PageData } from './$types';
  import { SignOut } from '@auth/sveltekit/components';

  export let data: PageData;
</script>

<svelte:head><title>Dashboard — Tukarbuku</title></svelte:head>

<main class="dashboard-page">
  <header class="dashboard-header"><a class="brand" href="/"><span class="brand-mark">↗</span>Tukarbuku</a><SignOut><span slot="submitButton" class="signout">Keluar</span></SignOut></header>
  <section class="welcome"><p class="eyebrow">Ruang baca kamu</p><h1>Halo, {data.session?.user?.name ?? 'pembaca'}.</h1><p>Dashboard ini sudah terlindungi session Google. Data buku, transaksi, dan pesan akan masuk di sini.</p></section>
  <div class="dashboard-grid"><article><span class="card-icon">▧</span><h2>Buku saya</h2><p>Belum ada listing. Siapkan buku yang ingin berpindah tangan.</p><a href="/dashboard/buku-baru">Tambah buku ↗</a></article><article><span class="card-icon">↔</span><h2>Transaksi</h2><p>Pengajuan jual dan barter yang sedang berjalan akan tampil di sini.</p><span class="muted">Belum ada transaksi</span></article><article><span class="card-icon">⌁</span><h2>Pesan</h2><p>Mulai percakapan dari halaman detail buku untuk berkoordinasi.</p><a href="/">Jelajahi buku ↗</a></article></div>
</main>

<style>
  :global(body) { background: #f7f7f2; }.dashboard-page { min-height: 100vh; max-width: 1200px; margin: auto; padding: 0 clamp(20px, 6vw, 80px) 80px; }.dashboard-header { height: 76px; border-bottom: 1px solid #dce3de; display: flex; justify-content: space-between; align-items: center; }.brand { color: #162326; text-decoration: none; font-size: 18px; font-weight: 800; display: flex; align-items: center; gap: 9px; }.brand-mark { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: #f1a179; transform: rotate(-12deg); }.signout { color: #74827e; font: 10px 'DM Mono', monospace; cursor: pointer; }.welcome { padding: 75px 0 55px; max-width: 620px; }.eyebrow { color: #d2704e; font: 10px 'DM Mono', monospace; letter-spacing: .1em; text-transform: uppercase; }.welcome h1 { color: #1a3032; font: 700 clamp(42px, 6vw, 68px)/1 'Playfair Display', serif; letter-spacing: -.06em; margin: 20px 0; }.welcome p:last-child { color: #73827d; font-size: 13px; line-height: 1.8; }.dashboard-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }.dashboard-grid article { background: #e3eee8; padding: 27px; min-height: 220px; display: flex; flex-direction: column; align-items: start; }.dashboard-grid article:nth-child(2) { background: #f3e4cf; }.dashboard-grid article:nth-child(3) { background: #e1e0eb; }.card-icon { color: #d2704e; font-size: 25px; }.dashboard-grid h2 { font: 700 22px 'Playfair Display', serif; margin: 20px 0 8px; }.dashboard-grid p { color: #6d7c77; font-size: 11px; line-height: 1.7; margin: 0 0 20px; }.dashboard-grid a, .muted { color: #d2704e; font: 10px 'DM Mono', monospace; text-decoration: none; margin-top: auto; }.muted { color: #899590; }
  @media (max-width: 700px) { .dashboard-grid { grid-template-columns: 1fr; }.welcome { padding-top: 55px; } }
</style>
