<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
  let saved = false;
</script>

<svelte:head>
  <title>{data.book.title} — Tukarbuku</title>
  <meta name="description" content={`${data.book.title} oleh ${data.book.author}, tersedia di Tukarbuku.`} />
</svelte:head>

<header class="topbar">
  <a class="brand" href="/" aria-label="Tukarbuku beranda"><span class="brand-mark">↗</span><span>Tukarbuku</span></a>
  <nav aria-label="Navigasi utama"><a class="nav-link active" href="/">Jelajah buku</a><a class="nav-link" href="/#cara-kerja">Cara kerja</a></nav>
  <div class="header-actions"><a class="login-link" href="/login?redirectTo=/buku/{data.book.id}">Masuk</a><a class="sell-button" href="/dashboard/buku-baru">Jual buku <span>＋</span></a></div>
</header>

<main class="detail-page">
  <a class="back-link" href="/">← Kembali ke jelajah</a>
  <div class="detail-grid">
    <section class="visual-column" aria-label={`Sampul ${data.book.title}`}>
      <div class="cover-wrap accent-{data.book.accent}"><img src={data.book.cover} alt={`Sampul buku ${data.book.title}`} /></div>
      <p class="image-note">Foto sampul dari pemilik buku<br /><span>kondisi sesuai keterangan listing</span></p>
    </section>
    <section class="detail-copy">
      <div class="topline"><span class="listing-badge {data.book.listingType.toLowerCase()}">{data.book.listingType === 'JUAL' ? 'Dijual' : 'Barter'}</span><button class="save-detail" class:saved on:click={() => (saved = !saved)} aria-label={saved ? 'Hapus dari simpanan' : 'Simpan buku'}>{saved ? '♥' : '♡'} {saved ? 'Tersimpan' : 'Simpan'}</button></div>
      <h1>{data.book.title}</h1>
      <p class="author">oleh <strong>{data.book.author}</strong></p>
      <div class="facts"><div><span>Kondisi</span><strong>{data.book.condition}</strong></div><div><span>Lokasi COD</span><strong>⌖ {data.book.city}</strong></div><div><span>Pemilik</span><strong>{data.book.seller}</strong></div></div>
      <div class="offer"><span>{data.book.listingType === 'JUAL' ? 'Harga buku' : 'Yang dicari sebagai ganti'}</span><strong>{data.book.listingType === 'JUAL' ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(data.book.price ?? 0) : data.book.wantedInExchange}</strong></div>
      <div class="description"><h2>Tentang buku ini</h2><p>Buku siap berpindah ke pembaca baru. Kondisi dan detail akan dikonfirmasi langsung dengan pemilik sebelum meetup.</p></div>
      <div class="actions"><a class="primary-action" href={`/login?redirectTo=/buku/${data.book.id}`}>{data.book.listingType === 'JUAL' ? 'Hubungi penjual' : 'Ajukan barter'} <span>↗</span></a><p class="action-note">Masuk dengan Google untuk memulai percakapan.<br />Semua komunikasi tetap tersimpan di Tukarbuku.</p></div>
    </section>
  </div>
</main>

<footer><div class="footer-brand"><span class="brand-mark">↗</span><strong>Tukarbuku</strong><p>Karena setiap buku layak<br />menemukan pembaca baru.</p></div><div><p class="footer-label">Jelajahi</p><a href="/">Buku dijual</a><a href="/">Buku dibarter</a></div><div><p class="footer-label">Tentang</p><a href="/#cara-kerja">Cara kerja</a><a href="/dashboard">Dashboard</a></div><small>© 2024 Tukarbuku · dibuat untuk cerita yang terus berjalan.</small></footer>

<style>
  :global(body) { background: #f7f7f2; }.topbar { height: 76px; padding: 0 clamp(20px, 5vw, 76px); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #dde3df; background: rgba(247,247,242,.92); position: sticky; top: 0; z-index: 5; backdrop-filter: blur(12px); }.brand, .nav-link, .login-link, .sell-button, footer a { text-decoration: none; color: inherit; }.brand { display: flex; align-items: center; gap: 9px; font-weight: 800; letter-spacing: -.04em; font-size: 18px; }.brand-mark { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: #f1a179; color: #18282b; font-size: 20px; font-weight: 800; transform: rotate(-12deg); }.topbar nav { display: flex; gap: 30px; margin-left: 7vw; }.nav-link { color: #75817e; font-size: 13px; font-weight: 700; }.nav-link.active { color: #162326; }.header-actions { display: flex; align-items: center; gap: 22px; }.login-link { font-size: 13px; font-weight: 700; }.sell-button { background: #1e3437; color: white; padding: 12px 17px; border-radius: 4px; font-size: 12px; font-weight: 800; }.sell-button span { margin-left: 10px; font-size: 16px; }
  .detail-page { max-width: 1120px; margin: auto; padding: 45px clamp(20px, 6vw, 90px) 90px; }.back-link { color: #6f807b; font: 11px 'DM Mono', monospace; text-decoration: none; }.detail-grid { display: grid; grid-template-columns: minmax(280px, 440px) 1fr; gap: clamp(40px, 8vw, 110px); align-items: start; margin-top: 35px; }.cover-wrap { height: 530px; display: grid; place-items: center; }.accent-apricot { background: #f2dfca; }.accent-sage { background: #d4dfd2; }.accent-lilac { background: #dfd9e6; }.accent-sky { background: #d3e3e6; }.accent-yellow { background: #f1e7bd; }.accent-rose { background: #ebd5d0; }.accent-mint { background: #d7e6dc; }.accent-blue { background: #d8dfed; }.cover-wrap img { width: 250px; height: 355px; object-fit: cover; box-shadow: 13px 18px 24px rgba(28,50,50,.18); }.image-note { color: #8a9792; font: 9px/1.6 'DM Mono', monospace; margin: 14px 0; }.image-note span { color: #b0b9b4; }.topline { display: flex; justify-content: space-between; align-items: center; }.listing-badge { border-radius: 2px; padding: 6px 9px; font: 9px 'DM Mono'; }.listing-badge.jual { background: #f5e6d5; color: #d36c4b; }.listing-badge.barter { background: #d6ebe0; color: #39715b; }.save-detail { background: transparent; border: 0; color: #798985; font-size: 11px; }.save-detail.saved { color: #cf6f4d; }.detail-copy h1 { font: 700 clamp(39px, 5vw, 62px)/1.02 'Playfair Display', serif; letter-spacing: -.06em; margin: 25px 0 8px; color: #1a3032; }.author { color: #7a8985; font-size: 13px; margin: 0 0 33px; }.author strong { color: #334744; }.facts { border-top: 1px solid #dce3de; border-bottom: 1px solid #dce3de; display: grid; grid-template-columns: repeat(3, 1fr); padding: 16px 0; gap: 10px; }.facts div { display: flex; flex-direction: column; gap: 7px; border-right: 1px solid #e3e8e3; }.facts div:last-child { border: 0; }.facts span, .offer > span { color: #8b9893; font: 9px 'DM Mono', monospace; text-transform: uppercase; }.facts strong { color: #425550; font-size: 11px; }.offer { display: flex; flex-direction: column; gap: 8px; padding: 25px 0; border-bottom: 1px solid #dce3de; }.offer strong { color: #d2704e; font: 700 19px 'Playfair Display', serif; }.description { padding: 24px 0 8px; }.description h2 { font: 700 18px 'Playfair Display', serif; margin: 0 0 10px; }.description p { color: #73827d; font-size: 12px; line-height: 1.8; margin: 0; }.actions { margin-top: 24px; }.primary-action { display: flex; justify-content: space-between; align-items: center; background: #1e3437; color: white; text-decoration: none; padding: 16px 18px; font-size: 12px; font-weight: 800; }.primary-action span { color: #f1a179; font-size: 19px; }.action-note { color: #8a9792; font: 9px/1.6 'DM Mono', monospace; margin: 11px 0; }
  footer { background: #1e3437; color: #d8e5df; padding: 50px clamp(20px, 5vw, 76px); display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: 25px; }.footer-brand { display: flex; flex-direction: column; align-items: start; }.footer-brand strong { margin-top: 12px; }.footer-brand p { color: #9bb0a8; font-size: 11px; line-height: 1.6; margin: 12px 0 0; }.footer-label { color: #eaa681; font: 10px 'DM Mono'; text-transform: uppercase; letter-spacing: .1em; margin: 5px 0 17px; }.footer-brand ~ div a { display: block; color: #c5d4ce; font-size: 11px; margin-bottom: 11px; }.footer-brand + div ~ small { align-self: end; color: #839992; font: 9px 'DM Mono'; }
  @media (max-width: 800px) { .topbar nav { display: none; }.detail-grid { grid-template-columns: 1fr; gap: 25px; }.cover-wrap { height: min(120vw, 480px); }.detail-copy h1 { font-size: 47px; } footer { grid-template-columns: 1fr 1fr; } footer small { grid-column: 1 / -1; } } @media (max-width: 480px) { .topbar { height: 65px; padding: 0 18px; }.header-actions { gap: 10px; }.login-link { display: none; }.sell-button { padding: 10px 11px; }.detail-page { padding-top: 30px; }.cover-wrap img { width: 205px; height: 290px; }.facts strong { font-size: 10px; } footer { padding: 38px 20px; gap: 30px 15px; } }
</style>
