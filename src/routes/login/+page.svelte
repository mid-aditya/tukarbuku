<script lang="ts">
  import { SignIn } from '@auth/sveltekit/components';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head><title>Masuk — Tukarbuku</title></svelte:head>

<header class="site-header">
  <a class="wordmark" href="/" aria-label="Tukarbuku beranda"><span>TB</span>Tukarbuku</a>
  <nav aria-label="Konteks halaman"><a href="/">Koleksi</a><span aria-current="page">Masuk</span></nav>
</header>

<main class="login-shell">
  <section class="context-panel" aria-labelledby="context-title">
    <p class="section-label">Akun pembaca</p>
    <h1 id="context-title">Kesepakatan buku tetap tercatat di satu tempat.</h1>
    <p>Masuk untuk menghubungi pemilik buku, mengajukan barter, dan membuka kembali riwayat percakapanmu.</p>
    <dl>
      <div><dt>01</dt><dd>Gunakan chat untuk menyepakati kondisi buku.</dd></div>
      <div><dt>02</dt><dd>Pilih lokasi COD yang ramai dan mudah dijangkau.</dd></div>
      <div><dt>03</dt><dd>Periksa buku sebelum membayar atau menukar.</dd></div>
    </dl>
  </section>

  <section class="login-panel" aria-labelledby="login-title">
    <p class="section-label">Masuk ke Tukarbuku</p>
    <h2 id="login-title">Lanjutkan dengan Google</h2>
    <p class="lead">Kami menggunakan akun Google agar kamu tidak perlu membuat dan mengingat kata sandi baru.</p>
    <SignIn provider="google" callbackUrl={data.redirectTo}>
      <div slot="submitButton" class="google-button" aria-hidden="true"><span>G</span><strong>Masuk dengan Google</strong></div>
    </SignIn>
    <p class="privacy">Nama, email, dan foto profil dasar digunakan untuk membuat akun Tukarbuku. Kami tidak akan membagikan kontak pribadimu di listing.</p>
    <a class="back" href="/">Kembali ke koleksi buku</a>
  </section>
</main>

<style>
  :global(body) { background: var(--paper); }
  .site-header { height: 72px; padding: 0 clamp(20px, 5vw, 72px); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); background: rgba(250, 250, 247, .96); }
  .wordmark { display: flex; gap: 10px; align-items: center; color: var(--ink); text-decoration: none; font-weight: 750; letter-spacing: -.03em; }
  .wordmark span { display: grid; place-items: center; width: 32px; height: 32px; background: var(--ink); color: white; font-size: 11px; letter-spacing: .04em; }
  .site-header nav { align-self: stretch; display: flex; align-items: center; gap: 28px; }
  .site-header nav a, .site-header nav span { position: relative; height: 100%; display: flex; align-items: center; color: var(--stone); text-decoration: none; font-size: 14px; font-weight: 600; }
  .site-header nav span { color: var(--ink); }
  .site-header nav span::after { content: ''; position: absolute; right: 0; bottom: -1px; left: 0; height: 3px; background: var(--leaf); }
  .login-shell { min-height: calc(100vh - 72px); max-width: 1180px; margin: 0 auto; padding: clamp(48px, 8vw, 104px) clamp(20px, 5vw, 64px); display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(360px, .85fr); gap: clamp(48px, 8vw, 112px); align-items: center; }
  .context-panel { max-width: 620px; }
  .section-label { margin: 0 0 20px; color: var(--leaf); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; font-weight: 800; }
  .context-panel h1 { margin: 0; max-width: 590px; font-size: clamp(40px, 5vw, 64px); line-height: 1.03; letter-spacing: -.055em; }
  .context-panel > p:not(.section-label) { max-width: 560px; margin: 24px 0 44px; color: var(--stone); font-size: 16px; line-height: 1.7; }
  .context-panel dl { margin: 0; border-top: 2px solid var(--ink); }
  .context-panel dl div { min-height: 58px; display: grid; grid-template-columns: 42px 1fr; align-items: center; border-bottom: 1px solid var(--border); }
  .context-panel dt { color: var(--leaf); font-size: 11px; font-weight: 800; }
  .context-panel dd { margin: 0; color: var(--stone); font-size: 13px; }
  .login-panel { padding: clamp(28px, 4vw, 46px); background: var(--surface); border: 1px solid var(--border); border-top: 3px solid var(--ink); }
  .login-panel h2 { margin: 0; font-size: clamp(27px, 3vw, 36px); line-height: 1.15; letter-spacing: -.04em; }
  .lead { margin: 16px 0 28px; color: var(--stone); font-size: 14px; line-height: 1.7; }
  .google-button { min-height: 54px; padding: 0 18px; display: flex; align-items: center; justify-content: center; gap: 14px; border: 1px solid #aeb8b1; border-radius: 4px; background: white; color: var(--ink); cursor: pointer; transition: border-color .15s ease, background .15s ease; }
  .google-button:hover { border-color: var(--ink); background: #f7f8f5; }
  .google-button span { width: 24px; height: 24px; display: grid; place-items: center; border: 1px solid var(--border); border-radius: 50%; color: #356fd2; font-size: 13px; font-weight: 800; }
  .google-button strong { font-size: 14px; }
  .privacy { margin: 18px 0 26px; padding-bottom: 24px; border-bottom: 1px solid var(--border); color: var(--stone); font-size: 12px; line-height: 1.65; }
  .back { min-height: 44px; display: inline-flex; align-items: center; color: var(--leaf); font-size: 13px; font-weight: 700; }
  @media (max-width: 800px) {
    .login-shell { grid-template-columns: 1fr; gap: 44px; align-items: start; }
    .context-panel { max-width: none; }
    .context-panel h1 { font-size: clamp(38px, 8vw, 54px); }
    .context-panel > p:not(.section-label) { margin-bottom: 28px; }
    .login-panel { width: 100%; max-width: 560px; }
  }
  @media (max-width: 520px) {
    .site-header { height: 64px; padding: 0 16px; }
    .site-header nav a { display: none; }
    .site-header nav span { font-size: 13px; }
    .login-shell { min-height: calc(100vh - 64px); padding: 38px 16px 48px; gap: 36px; }
    .context-panel h1 { font-size: 38px; }
    .context-panel > p:not(.section-label) { margin-top: 18px; font-size: 15px; }
    .context-panel dl div { grid-template-columns: 36px 1fr; padding: 8px 0; }
    .login-panel { padding: 28px 22px; }
  }
</style>
