<script lang="ts">
  import { SignIn } from '@auth/sveltekit/components';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>Masuk — Tukarbuku</title>
  <meta name="description" content="Masuk ke Tukarbuku dengan akun Google untuk menghubungi pemilik buku." />
</svelte:head>

<main class="login-page">
  <a class="brand" href="/"><span class="brand-mark">↗</span><span>Tukarbuku</span></a>
  <section class="login-card" aria-labelledby="login-title">
    <p class="eyebrow">Komunitas pembaca Indonesia</p>
    <h1 id="login-title">Masuk untuk<br /><em>lanjut bertukar.</em></h1>
    <p class="intro">Satu akun Google untuk menyimpan buku, menghubungi penjual, dan menjaga percakapan tetap di Tukarbuku.</p>
    <SignIn provider="google" callbackUrl={data.redirectTo}>
      <div slot="submitButton" class="google-button"><span class="google-icon">G</span> Lanjut dengan Google <span class="arrow">↗</span></div>
    </SignIn>
    <p class="privacy-note">Dengan masuk, kamu menyetujui komunikasi transaksi dilakukan di dalam Tukarbuku.</p>
    <a class="back-link" href="/">← Kembali menjelajah</a>
  </section>
</main>

<style>
  :global(body) { background: #dbe8e1; }.login-page { min-height: 100vh; padding: 28px clamp(20px, 7vw, 100px); background: radial-gradient(circle at 78% 30%, #f1aa7b 0 120px, transparent 121px), #dbe8e1; }.brand { display: flex; align-items: center; gap: 9px; text-decoration: none; color: #162326; font-size: 18px; font-weight: 800; letter-spacing: -.04em; }.brand-mark { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: #f1a179; font-size: 20px; transform: rotate(-12deg); }.login-card { width: min(100%, 480px); margin: 12vh auto 0; background: #f7f7f2; padding: clamp(32px, 6vw, 58px); box-shadow: 18px 18px 0 rgba(30,52,55,.1); }.eyebrow { color: #d2704e; font: 10px 'DM Mono', monospace; letter-spacing: .1em; text-transform: uppercase; }.login-card h1 { color: #1a3032; font: 700 clamp(40px, 7vw, 58px)/1 'Playfair Display', serif; letter-spacing: -.06em; margin: 22px 0; }.login-card h1 em { color: #d2704e; }.intro { color: #71817c; font-size: 13px; line-height: 1.75; margin-bottom: 30px; }.google-button { display: flex; align-items: center; justify-content: space-between; width: 100%; background: #1e3437; color: white; padding: 16px 18px; font-size: 12px; font-weight: 800; cursor: pointer; }.google-icon { display: grid; place-items: center; width: 23px; height: 23px; background: white; color: #4285f4; border-radius: 50%; font-weight: 800; }.arrow { color: #f1a179; font-size: 18px; }.privacy-note { color: #98a39e; font: 9px/1.6 'DM Mono', monospace; margin: 18px 0 30px; }.back-link { color: #687a75; font: 10px 'DM Mono', monospace; text-decoration: none; }
  @media (max-width: 520px) { .login-page { padding: 22px 18px; background: #dbe8e1; }.login-card { margin-top: 14vh; padding: 30px 24px; } }
</style>
