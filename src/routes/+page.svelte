<script lang="ts">
  import { cities, type Book, type Condition, type ListingType } from '$lib/data/books';

  export let data: { books: Book[] };

  let query = '';
  let type: 'SEMUA' | ListingType = 'SEMUA';
  let condition: 'Semua kondisi' | Condition = 'Semua kondisi';
  let city = 'Semua kota';
  let page = 1;
  const pageSize = 6;

  $: filteredBooks = data.books.filter((book) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = !normalizedQuery || `${book.title} ${book.author}`.toLowerCase().includes(normalizedQuery);
    const matchesType = type === 'SEMUA' || book.listingType === type;
    const matchesCondition = condition === 'Semua kondisi' || book.condition === condition;
    const matchesCity = city === 'Semua kota' || book.city === city;
    return matchesQuery && matchesType && matchesCondition && matchesCity;
  });
  $: totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize));
  $: page = Math.min(page, totalPages);
  $: visibleBooks = filteredBooks.slice((page - 1) * pageSize, page * pageSize);

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  const resetPage = () => (page = 1);
  const resetFilters = () => {
    query = '';
    type = 'SEMUA';
    condition = 'Semua kondisi';
    city = 'Semua kota';
    resetPage();
  };
</script>

<svelte:head><title>Tukarbuku — Buku berpindah, cerita berlanjut</title></svelte:head>

<header class="topbar">
  <a class="brand" href="/" aria-label="Tukarbuku beranda"><span class="brand-mark">↗</span><span>Tukarbuku</span></a>
  <nav aria-label="Navigasi utama">
    <a class="nav-link active" href="#jelajah">Jelajah buku</a>
    <a class="nav-link" href="#cara-kerja">Cara kerja</a>
  </nav>
  <div class="header-actions"><a class="login-link" href="/login">Masuk</a><a class="sell-button" href="/dashboard/buku-baru">Jual buku <span>＋</span></a></div>
</header>

<main>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow"><span class="eyebrow-dot"></span> Komunitas pembaca Indonesia</p>
      <h1 id="hero-title">Buku berpindah,<br /><em>cerita berlanjut.</em></h1>
      <p class="hero-description">Temukan buku bekas yang masih punya banyak halaman untuk dibaca. Jual, beli, atau barter langsung dengan pembaca di kotamu.</p>
      <div class="hero-stats"><div><strong>1.240+</strong><span>buku berputar</span></div><div><strong>18 kota</strong><span>di Indonesia</span></div><div><strong>100%</strong><span>bertemu langsung</span></div></div>
    </div>
    <div class="hero-art" aria-label="Ilustrasi tumpukan buku"><div class="sun-disc"></div><div class="sparkle sparkle-one">✦</div><div class="sparkle sparkle-two">✦</div><div class="book-stack"><div class="book book-back">membaca<br />adalah pulang</div><div class="book book-middle">THE<br /><b>ART</b><br />OF READING</div><div class="book book-front"><span>TUKAR</span><strong>BUKU</strong><small>edisi komunitas · 2024</small></div></div><div class="art-note">dibaca ulang,<br />bukan dibuang <span>↗</span></div></div>
  </section>

  <section class="explore" id="jelajah" aria-labelledby="explore-title">
    <div class="section-heading"><div><p class="eyebrow">Rak komunitas</p><h2 id="explore-title">Cari buku berikutnya</h2></div><p class="result-summary">{filteredBooks.length} buku siap berpindah <span>↗</span></p></div>
    <div class="filter-bar">
      <label class="search-field"><span aria-hidden="true">⌕</span><input bind:value={query} on:input={resetPage} type="search" placeholder="Cari judul atau penulis..." aria-label="Cari judul atau penulis" /></label>
      <div class="filter-group" aria-label="Tipe listing"><button class:chosen={type === 'SEMUA'} on:click={() => { type = 'SEMUA'; resetPage(); }}>Semua</button><button class:chosen={type === 'JUAL'} on:click={() => { type = 'JUAL'; resetPage(); }}>Dijual</button><button class:chosen={type === 'BARTER'} on:click={() => { type = 'BARTER'; resetPage(); }}>Barter</button></div>
      <label class="select-field"><span class="sr-only">Kondisi</span><select bind:value={condition} on:change={resetPage}><option>Semua kondisi</option><option>Baru</option><option>Baik</option><option>Cukup</option><option>Rusak ringan</option></select><span>⌄</span></label>
      <label class="select-field city-select"><span class="sr-only">Kota</span><select bind:value={city} on:change={resetPage}>{#each cities as cityName}<option>{cityName}</option>{/each}</select><span>⌄</span></label>
    </div>

    {#if visibleBooks.length > 0}
      <div class="book-grid">{#each visibleBooks as book (book.id)}<a class="book-card" href={`/buku/${book.id}`}><div class="cover-wrap accent-{book.accent}"><img src={book.cover} alt={`Sampul buku ${book.title}`} loading="lazy" /><span class="listing-badge {book.listingType.toLowerCase()}">{book.listingType === 'JUAL' ? 'Dijual' : 'Barter'}</span><button class="save-button" aria-label={`Simpan ${book.title}`} on:click|preventDefault>♡</button></div><div class="card-copy"><div class="card-title-row"><h3>{book.title}</h3><span class="condition">{book.condition}</span></div><p class="author">{book.author}</p><div class="card-meta"><strong>{book.listingType === 'JUAL' ? formatPrice(book.price ?? 0) : '↔ ' + book.wantedInExchange}</strong><span>⌖ {book.city}</span></div><div class="seller"><span class="avatar">{book.seller.charAt(0)}</span><span>oleh {book.seller}</span><span class="arrow">↗</span></div></div></a>{/each}</div>
    {:else}
      <div class="empty-state"><span>⌕</span><h3>Buku belum ditemukan</h3><p>Coba kata kunci atau filter yang berbeda.</p><button on:click={resetFilters}>Reset pencarian</button></div>
    {/if}
    <div class="pagination" aria-label="Pagination"><span>Menampilkan {visibleBooks.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredBooks.length)} dari {filteredBooks.length}</span><div><button disabled={page === 1} on:click={() => (page -= 1)} aria-label="Halaman sebelumnya">←</button><b>{page}</b><button disabled={page === totalPages} on:click={() => (page += 1)} aria-label="Halaman berikutnya">→</button></div></div>
  </section>
</main>

<footer id="cara-kerja"><div class="footer-brand"><span class="brand-mark">↗</span><strong>Tukarbuku</strong><p>Karena setiap buku layak<br />menemukan pembaca baru.</p></div><div><p class="footer-label">Jelajahi</p><a href="#jelajah">Buku dijual</a><a href="#jelajah">Buku dibarter</a></div><div><p class="footer-label">Tentang</p><a href="#cara-kerja">Cara kerja</a><a href="/dashboard">Dashboard</a></div><small>© 2024 Tukarbuku · dibuat untuk cerita yang terus berjalan.</small></footer>

<style>
  :global(body) { background: #f7f7f2; }
  .topbar { height: 76px; padding: 0 clamp(20px, 5vw, 76px); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #dde3df; background: rgba(247,247,242,.92); position: sticky; top: 0; z-index: 5; backdrop-filter: blur(12px); }
  .brand, .nav-link, .login-link, .sell-button, footer a { text-decoration: none; color: inherit; } .brand { display: flex; align-items: center; gap: 9px; font-weight: 800; letter-spacing: -.04em; font-size: 18px; }.brand-mark { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: #f1a179; color: #18282b; font-size: 20px; font-weight: 800; transform: rotate(-12deg); }.topbar nav { display: flex; gap: 30px; margin-left: 7vw; }.nav-link { color: #75817e; font-size: 13px; font-weight: 700; }.nav-link.active { color: #162326; }.header-actions { display: flex; align-items: center; gap: 22px; }.login-link { font-size: 13px; font-weight: 700; }.sell-button { background: #1e3437; color: white; padding: 12px 17px; border-radius: 4px; font-size: 12px; font-weight: 800; }.sell-button span { margin-left: 10px; font-size: 16px; }
  .hero { background: #dbe8e1; min-height: 485px; padding: 70px clamp(20px, 10vw, 150px) 60px; display: grid; grid-template-columns: 1.05fr .95fr; overflow: hidden; }.eyebrow { font: 500 10px 'DM Mono', monospace; color: #60716e; letter-spacing: .1em; text-transform: uppercase; margin: 0 0 17px; }.eyebrow-dot { width: 6px; height: 6px; display: inline-block; background: #e17f55; border-radius: 50%; margin: 0 7px 1px 0; }.hero h1 { font: 700 clamp(44px, 5vw, 73px)/.99 'Playfair Display', serif; letter-spacing: -.06em; margin: 0; color: #172b2e; }.hero h1 em { color: #d6724c; font-style: italic; }.hero-description { max-width: 410px; font-size: 14px; line-height: 1.75; color: #62716e; margin: 28px 0 42px; }.hero-stats { display: flex; gap: 33px; }.hero-stats div { display: flex; flex-direction: column; gap: 4px; border-left: 1px solid #aac2b9; padding-left: 12px; }.hero-stats strong { font: 700 20px 'Playfair Display', serif; }.hero-stats span { color: #647571; font-size: 10px; }.hero-art { position: relative; min-height: 350px; }.sun-disc { position: absolute; width: 225px; height: 225px; border-radius: 50%; background: #f2aa79; top: 16px; right: 18%; }.book-stack { position: absolute; top: 93px; left: 26%; width: 245px; height: 230px; transform: rotate(-8deg); }.book { position: absolute; box-shadow: 7px 8px 0 rgba(26,55,53,.12); }.book-back { width: 205px; height: 145px; top: 52px; left: 16px; padding: 43px 18px; background: #7d9f8d; color: #eff3e7; font: 700 18px/1.1 'Playfair Display'; transform: rotate(13deg); }.book-middle { width: 190px; height: 145px; top: 35px; left: 34px; padding: 17px; background: #d36351; color: #f7d2ac; font: 10px/1.25 'DM Mono'; transform: rotate(5deg); }.book-middle b { font: 700 36px 'Playfair Display'; color: #f8e4bb; }.book-front { width: 185px; height: 135px; top: 25px; left: 14px; padding: 25px 22px; background: #f4c969; color: #214447; transform: rotate(-9deg); display: flex; flex-direction: column; }.book-front span { font: 10px 'DM Mono'; letter-spacing: .15em; }.book-front strong { font: 700 29px 'Playfair Display'; margin-top: 8px; }.book-front small { margin-top: auto; font-size: 7px; }.sparkle { position: absolute; color: #e17f55; font-size: 28px; }.sparkle-one { top: 18px; right: 24%; }.sparkle-two { top: 205px; left: 4%; font-size: 16px; }.art-note { position: absolute; right: 0; bottom: 29px; font: 11px/1.4 'DM Mono'; color: #59716b; }.art-note span { color: #d6724c; font-size: 20px; margin-left: 7px; }
  .explore { padding: 71px clamp(20px, 5vw, 76px) 90px; max-width: 1440px; margin: auto; }.section-heading { display: flex; justify-content: space-between; align-items: end; margin-bottom: 30px; }.section-heading .eyebrow { margin-bottom: 8px; color: #da7651; }.section-heading h2 { margin: 0; font: 700 35px 'Playfair Display', serif; letter-spacing: -.04em; }.result-summary { color: #74827f; font: 10px 'DM Mono', monospace; }.result-summary span { color: #da7651; font-size: 16px; margin-left: 7px; }.filter-bar { display: flex; gap: 9px; margin-bottom: 28px; }.search-field, .select-field { display: flex; align-items: center; height: 42px; border: 1px solid #dbe1dc; background: white; border-radius: 3px; }.search-field { flex: 1; min-width: 190px; gap: 9px; padding: 0 13px; }.search-field span { font-size: 23px; color: #798985; transform: rotate(-20deg); }.search-field input, select { border: 0; outline: none; background: transparent; color: #41504d; font-size: 11px; width: 100%; }.filter-group { display: flex; background: #e8eeea; border-radius: 3px; padding: 4px; gap: 1px; }.filter-group button { border: 0; background: transparent; color: #73817e; padding: 0 14px; border-radius: 2px; font-size: 11px; font-weight: 700; }.filter-group button.chosen { background: #1e3437; color: white; }.select-field { width: 143px; padding: 0 11px; position: relative; }.select-field select { appearance: none; padding-right: 12px; }.select-field > span:not(.sr-only) { position: absolute; right: 10px; pointer-events: none; color: #75817f; }.city-select { width: 155px; }.sr-only { position: absolute; width: 1px; height: 1px; clip: rect(0,0,0,0); overflow: hidden; }
  .book-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px 22px; }.book-card { color: inherit; text-decoration: none; }.cover-wrap { height: 250px; display: flex; justify-content: center; align-items: center; position: relative; overflow: hidden; }.accent-apricot { background: #f2dfca; }.accent-sage { background: #d4dfd2; }.accent-lilac { background: #dfd9e6; }.accent-sky { background: #d3e3e6; }.accent-yellow { background: #f1e7bd; }.accent-rose { background: #ebd5d0; }.accent-mint { background: #d7e6dc; }.accent-blue { background: #d8dfed; }.cover-wrap img { width: 135px; height: 190px; object-fit: cover; box-shadow: 8px 10px 16px rgba(28,50,50,.17); transition: transform .25s ease; }.book-card:hover .cover-wrap img { transform: translateY(-7px) rotate(-2deg); }.listing-badge { position: absolute; left: 12px; top: 12px; border-radius: 2px; padding: 5px 8px; font: 9px 'DM Mono'; }.listing-badge.jual { background: #f9f4e8; color: #d36c4b; }.listing-badge.barter { background: #d6ebe0; color: #39715b; }.save-button { position: absolute; right: 11px; top: 10px; border: 0; background: rgba(255,255,255,.65); width: 27px; height: 27px; border-radius: 50%; color: #5d706d; font-size: 17px; }.card-copy { padding-top: 13px; }.card-title-row { display: flex; gap: 8px; align-items: start; justify-content: space-between; }.card-title-row h3 { font: 700 16px/1.25 'Playfair Display', serif; margin: 0; }.condition { border: 1px solid #ccd5d0; color: #71807c; padding: 3px 5px; font: 8px 'DM Mono'; white-space: nowrap; }.author { color: #7c8985; margin: 5px 0 14px; font-size: 11px; }.card-meta { display: flex; flex-direction: column; gap: 4px; min-height: 37px; }.card-meta strong { color: #d56f4d; font-size: 12px; }.card-meta span { color: #71807c; font-size: 10px; }.seller { border-top: 1px solid #e0e5e0; display: flex; align-items: center; gap: 7px; padding-top: 10px; margin-top: 12px; color: #8a9692; font-size: 10px; }.avatar { display: grid; place-items: center; width: 21px; height: 21px; background: #e5b5a3; border-radius: 50%; color: #743e32; font-size: 9px; font-weight: 800; }.arrow { margin-left: auto; color: #d27451; font-size: 16px; }.pagination { border-top: 1px solid #dce2dd; margin-top: 40px; padding-top: 18px; display: flex; justify-content: space-between; align-items: center; color: #81908b; font: 10px 'DM Mono'; }.pagination div { display: flex; align-items: center; gap: 15px; }.pagination button { border: 0; background: transparent; color: #d27451; font-size: 18px; }.pagination button:disabled { color: #bdc6c1; cursor: not-allowed; }.empty-state { text-align: center; border: 1px dashed #c8d2cc; padding: 55px 20px; color: #73817e; }.empty-state > span { font-size: 35px; }.empty-state h3 { margin: 10px 0 4px; font: 700 20px 'Playfair Display'; color: #263b3d; }.empty-state p { font-size: 12px; }.empty-state button { border: 0; background: #1e3437; color: white; padding: 10px 14px; border-radius: 3px; font-size: 11px; }
  footer { background: #1e3437; color: #d8e5df; padding: 50px clamp(20px, 5vw, 76px); display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: 25px; }.footer-brand { display: flex; flex-direction: column; align-items: start; }.footer-brand strong { margin-top: 12px; }.footer-brand p { color: #9bb0a8; font-size: 11px; line-height: 1.6; margin: 12px 0 0; }.footer-label { color: #eaa681; font: 10px 'DM Mono'; text-transform: uppercase; letter-spacing: .1em; margin: 5px 0 17px; }.footer-brand ~ div a { display: block; color: #c5d4ce; font-size: 11px; margin-bottom: 11px; }.footer-brand + div ~ small { align-self: end; color: #839992; font: 9px 'DM Mono'; }
  @media (max-width: 800px) { .topbar nav { display: none; }.hero { grid-template-columns: 1fr; padding-top: 52px; }.hero-art { min-height: 280px; margin-top: 15px; }.sun-disc { right: 19%; }.book-stack { left: 27%; top: 48px; transform: scale(.85) rotate(-8deg); transform-origin: top left; }.art-note { right: 7%; bottom: 0; }.filter-bar { flex-wrap: wrap; }.search-field { flex-basis: 100%; }.book-grid { grid-template-columns: repeat(2, 1fr); }.cover-wrap { height: 210px; }.cover-wrap img { width: 113px; height: 160px; } footer { grid-template-columns: 1fr 1fr; } footer small { grid-column: 1 / -1; } }
  @media (max-width: 480px) { .topbar { height: 65px; padding: 0 18px; }.header-actions { gap: 10px; }.login-link { display: none; }.sell-button { padding: 10px 11px; }.hero { padding-left: 20px; padding-right: 20px; }.hero h1 { font-size: 46px; }.hero-stats { gap: 16px; }.hero-stats strong { font-size: 16px; }.hero-stats span { font-size: 9px; }.section-heading { display: block; }.result-summary { margin-top: 14px; }.filter-group { width: 100%; }.filter-group button { flex: 1; }.select-field { flex: 1; width: auto; }.book-grid { gap: 28px 13px; }.cover-wrap { height: 175px; }.cover-wrap img { width: 91px; height: 132px; }.card-title-row h3 { font-size: 14px; }.condition { display: none; }.card-meta strong { font-size: 10px; }.pagination { font-size: 8px; } footer { padding: 38px 20px; gap: 30px 15px; } }
</style>
