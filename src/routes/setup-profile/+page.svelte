<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;
	let name = data.session.user.name ?? '';
	let city = '';
	let phone = '';
</script>

<svelte:head>
	<title>Lengkapi Profil — Tukarbuku</title>
</svelte:head>

<header class="site-header">
	<a class="wordmark" href="/" aria-label="Tukarbuku beranda"><span>TB</span>Tukarbuku</a>
	<nav aria-label="Konteks halaman"><a href="/">Koleksi</a><span aria-current="page">Lengkapi Profil</span></nav>
</header>

<main class="profile-shell">
	<div class="profile-panel">
		<div class="panel-head">
			<p class="section-label">Akun</p>
			<h1>Lengkapi profil pembaca</h1>
			<p class="lead">Nama dan kota ditampilkan di listing buku-mu agar pembeli bisa menentukan lokasi COD.</p>
		</div>

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<div class="field-row">
				<div class="field">
					<label for="name">Nama tampilan</label>
					<input id="name" name="name" type="text" bind:value={name} required maxlength="120" />
				</div>
				<div class="field">
					<label for="city">Kota domisili <span class="required">*</span></label>
					<input id="city" name="city" type="text" bind:value={city} required maxlength="100" placeholder="Contoh: Bandung" />
				</div>
			</div>

			<div class="field">
				<label for="phone">
					Nomor HP
					<span class="hint">Opsional, tapi membantu penjual memastikan jadwal COD.</span>
				</label>
				<input id="phone" name="phone" type="tel" bind:value={phone} maxlength="32" placeholder="08xxxxxxxxxx" autocomplete="tel" />
			</div>

			{#if form?.error}
				<p class="error" role="alert">{form.error}</p>
			{/if}

			<div class="actions">
				<button type="submit" disabled={loading} class="primary">
					{loading ? 'Menyimpan…' : 'Simpan profil'}
				</button>
			</div>
		</form>

		<p class="privacy">Profil hanya digunakan untuk memfasilitasi transaksi COD. Nomor HP tidak ditampilkan di listing.</p>
	</div>
</main>

<style>
	:global(body) { background: var(--paper); }
	.site-header {
		height: 72px;
		padding: 0 clamp(20px, 5vw, 72px);
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--border);
		background: rgba(250, 250, 247, .96);
	}
	.wordmark {
		display: flex;
		gap: 10px;
		align-items: center;
		color: var(--ink);
		text-decoration: none;
		font-weight: 750;
		letter-spacing: -.03em;
	}
	.wordmark span {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		background: var(--ink);
		color: white;
		font-size: 11px;
		letter-spacing: .04em;
	}
	.site-header nav {
		align-self: stretch;
		display: flex;
		align-items: center;
		gap: 28px;
	}
	.site-header nav a,
	.site-header nav span {
		display: flex;
		align-items: center;
		height: 100%;
		color: var(--stone);
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
	}
	.site-header nav span {
		color: var(--ink);
		position: relative;
	}
	.site-header nav span::after {
		content: '';
		position: absolute;
		right: 0;
		bottom: -1px;
		left: 0;
		height: 3px;
		background: var(--leaf);
	}
	.profile-shell {
		min-height: calc(100vh - 72px);
		display: grid;
		place-items: center;
		padding: clamp(48px, 8vw, 88px) clamp(20px, 5vw, 64px);
	}
	.profile-panel {
		width: 100%;
		max-width: 620px;
		padding: clamp(32px, 5vw, 52px);
		background: var(--surface);
		border: 1px solid var(--border);
		border-top: 3px solid var(--ink);
	}
	.panel-head {
		margin-bottom: 36px;
	}
	.section-label {
		margin: 0 0 16px;
		color: var(--leaf);
		font-size: 11px;
		letter-spacing: .12em;
		text-transform: uppercase;
		font-weight: 800;
	}
	.panel-head h1 {
		margin: 0 0 10px;
		font-size: clamp(28px, 4vw, 42px);
		letter-spacing: -.04em;
		line-height: 1.1;
	}
	.lead {
		margin: 0;
		color: var(--stone);
		font-size: 14px;
		line-height: 1.65;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	label {
		font-size: 12px;
		font-weight: 700;
		color: var(--ink);
	}
	label .hint {
		font-weight: 400;
		color: var(--stone);
		margin-left: 6px;
	}
	.required {
		color: var(--orange);
	}
	input {
		height: 48px;
		padding: 0 14px;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: white;
		color: var(--ink);
		font-size: 14px;
		transition: border-color .15s ease, box-shadow .15s ease;
	}
	input:focus {
		outline: 0;
		border-color: var(--leaf);
		box-shadow: 0 0 0 3px rgba(40, 96, 68, .12);
	}
	input::placeholder {
		color: var(--stone);
	}
	.error {
		margin: 0;
		padding: 12px 14px;
		background: #fff0e9;
		border-left: 3px solid var(--orange);
		color: #b9491d;
		font-size: 13px;
	}
	.actions {
		padding-top: 8px;
	}
	.primary {
		min-height: 50px;
		padding: 0 22px;
		background: var(--leaf);
		color: white;
		border: 0;
		border-radius: 4px;
		font-size: 14px;
		font-weight: 750;
		cursor: pointer;
		transition: background .15s ease;
	}
	.primary:hover:not(:disabled) {
		background: var(--leaf-dark);
	}
	.primary:disabled {
		opacity: .55;
		cursor: not-allowed;
	}
	.privacy {
		margin: 20px 0 0;
		padding-top: 18px;
		border-top: 1px solid var(--border);
		color: var(--stone);
		font-size: 12px;
		line-height: 1.6;
	}
	@media (max-width: 520px) {
		.site-header { height: 64px; padding: 0 16px; }
		.site-header nav a { display: none; }
		.site-header nav span { font-size: 13px; }
		.profile-shell { padding: 36px 16px 52px; }
		.field-row { grid-template-columns: 1fr; }
	}
</style>
