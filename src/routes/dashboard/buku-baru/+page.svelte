<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let loading = false;
	let listingType: 'JUAL' | 'BARTER' = 'JUAL';
</script>

<svelte:head>
	<title>Pasang Buku — Tukarbuku</title>
</svelte:head>

<header class="site-header">
	<a class="wordmark" href="/" aria-label="Tukarbuku beranda"><span>TB</span>Tukarbuku</a>
	<nav aria-label="Navigasi akun"><a href="/dashboard">Dashboard</a><span aria-current="page">Pasang Buku</span></nav>
</header>

<main class="form-shell">
	<div class="form-panel">
		<div class="panel-head">
			<p class="section-label">Pasang listing baru</p>
			<h1>Ceritakan buku yang ingin berpindah.</h1>
			<p class="lead">Semakin lengkap deskripsinya, semakin cepat pembeli menemukan dan tertarik.</p>
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
			<!-- Tipe listing -->
			<fieldset class="listing-type">
				<legend>Tipe listing</legend>
				<label class="radio-card" class:active={listingType === 'JUAL'}>
					<input type="radio" name="listingType" value="JUAL" bind:group={listingType} />
					<strong>Dijual</strong>
					<span>Pembeli membayar harga yang kamu tentukan.</span>
				</label>
				<label class="radio-card" class:active={listingType === 'BARTER'}>
					<input type="radio" name="listingType" value="BARTER" bind:group={listingType} />
					<strong>Barter</strong>
					<span>Kamu menukar dengan buku lain yang kamu inginkan.</span>
				</label>
			</fieldset>

			<div class="field-row">
				<div class="field">
					<label for="title">Judul buku <span class="required">*</span></label>
					<input id="title" name="title" type="text" required maxlength="200" placeholder="Contoh: Laut Bercerita" />
				</div>
				<div class="field">
					<label for="author">Penulis <span class="required">*</span></label>
					<input id="author" name="author" type="text" required maxlength="160" placeholder="Contoh: Leila S. Chudori" />
				</div>
			</div>

			<div class="field-row">
				<div class="field">
					<label for="condition">Kondisi <span class="required">*</span></label>
					<div class="select-wrapper">
						<select id="condition" name="condition" required>
							<option value="">Pilih kondisi</option>
							<option value="baru">Baru — belum pernah dibaca</option>
							<option value="baik">Baik — layak dibaca, tanpa kerusakan berarti</option>
							<option value="cukup">Cukup — ada kerusakan ringan (sampul kusut, coretan tipis)</option>
							<option value="rusak-ringan">Rusak Ringan — perlu perbaikan kecil</option>
						</select>
					</div>
				</div>
				<div class="field">
					<label for="city">Kota COD <span class="required">*</span></label>
					<input id="city" name="city" type="text" required maxlength="100" placeholder="Contoh: Bandung" />
				</div>
			</div>

			<div class="field">
				<label for="description">Deskripsi kondisi <span class="required">*</span></label>
				<textarea id="description" name="description" required maxlength="5000" rows="4" placeholder="Ceritakan kondisi buku secara detail: ada noda, robekan, catatan di halaman, dll."></textarea>
			</div>

			<div class="field">
				<label for="coverImageUrl">URL Foto Sampul <span class="required">*</span></label>
				<input id="coverImageUrl" name="coverImageUrl" type="url" required maxlength="2048" placeholder="https://..." />
				<span class="field-hint">Tempelkan URL gambar sampul buku. Format yang didukung: JPG, PNG, WebP.</span>
			</div>

			{#if listingType === 'JUAL'}
				<div class="field">
					<label for="price">Harga <span class="required">*</span></label>
					<div class="input-prefix">
						<span>Rp</span>
						<input id="price" name="price" type="number" min="0" max="100000000" step="1000" placeholder="65000" />
					</div>
				</div>
			{:else}
				<div class="field">
					<label for="wantedInExchange">Buku yang kamu inginkan <span class="required">*</span></label>
					<textarea id="wantedInExchange" name="wantedInExchange" maxlength="1000" rows="3" placeholder="Contoh: Buku nonfiksi tentang psikologi, novel sastra Indonesia, dll."></textarea>
				</div>
			{/if}

			{#if form?.error}
				<p class="error" role="alert">{form.error}</p>
			{/if}

			<div class="actions">
				<a href="/dashboard" class="cancel">Batal</a>
				<button type="submit" disabled={loading} class="primary">
					{loading ? 'Menyimpan…' : 'Pasang listing'}
				</button>
			</div>
		</form>
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
	}
	.site-header nav {
		display: flex;
		align-items: center;
		gap: 28px;
	}
	.site-header nav a,
	.site-header nav span {
		color: var(--stone);
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
	}
	.site-header nav span {
		color: var(--ink);
	}
	.form-shell {
		min-height: calc(100vh - 72px);
		padding: clamp(40px, 6vw, 72px) clamp(20px, 5vw, 64px);
	}
	.form-panel {
		max-width: 760px;
		margin: 0 auto;
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
	.listing-type {
		border: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	.listing-type legend {
		font-size: 12px;
		font-weight: 700;
		color: var(--ink);
		margin-bottom: 10px;
	}
	.radio-card {
		border: 1px solid var(--border);
		border-radius: 4px;
		padding: 16px;
		cursor: pointer;
		transition: border-color .15s ease, background .15s ease;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.radio-card input {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
	}
	.radio-card strong {
		font-size: 14px;
	}
	.radio-card span {
		font-size: 12px;
		color: var(--stone);
	}
	.radio-card.active {
		border-color: var(--leaf);
		background: #edf2ee;
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
	.required {
		color: var(--orange);
	}
	input,
	textarea,
	select {
		border: 1px solid var(--border);
		border-radius: 4px;
		background: white;
		color: var(--ink);
		font-size: 14px;
		transition: border-color .15s ease, box-shadow .15s ease;
	}
	input:focus,
	textarea:focus,
	select:focus {
		outline: 0;
		border-color: var(--leaf);
		box-shadow: 0 0 0 3px rgba(40, 96, 68, .12);
	}
	input::placeholder,
	textarea::placeholder {
		color: var(--stone);
	}
	input[type="text"],
	input[type="url"],
	input[type="number"] {
		height: 48px;
		padding: 0 14px;
	}
	textarea {
		padding: 12px 14px;
		resize: vertical;
		line-height: 1.6;
	}
	.select-wrapper {
		position: relative;
	}
	.select-wrapper select {
		width: 100%;
		height: 48px;
		padding: 0 36px 0 14px;
		appearance: none;
		cursor: pointer;
	}
	.select-wrapper::after {
		content: '';
		position: absolute;
		right: 14px;
		top: 50%;
		transform: translateY(-50%) rotate(45deg);
		width: 7px;
		height: 7px;
		border-right: 2px solid var(--stone);
		border-bottom: 2px solid var(--stone);
		pointer-events: none;
	}
	.input-prefix {
		display: flex;
		align-items: center;
		border: 1px solid var(--border);
		border-radius: 4px;
		overflow: hidden;
		transition: border-color .15s ease, box-shadow .15s ease;
	}
	.input-prefix:focus-within {
		border-color: var(--leaf);
		box-shadow: 0 0 0 3px rgba(40, 96, 68, .12);
	}
	.input-prefix span {
		padding: 0 12px;
		height: 48px;
		display: flex;
		align-items: center;
		background: var(--muted);
		color: var(--stone);
		font-size: 13px;
		font-weight: 700;
		border-right: 1px solid var(--border);
	}
	.input-prefix input {
		flex: 1;
		height: 48px;
		padding: 0 14px;
		border: 0;
		border-radius: 0;
		box-shadow: none;
	}
	.input-prefix input:focus {
		border: 0;
		box-shadow: none;
	}
	.field-hint {
		font-size: 11px;
		color: var(--stone);
		line-height: 1.5;
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
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 12px;
		padding-top: 8px;
	}
	.cancel {
		min-height: 46px;
		padding: 0 18px;
		display: flex;
		align-items: center;
		color: var(--stone);
		text-decoration: none;
		font-size: 14px;
		font-weight: 700;
	}
	.primary {
		min-height: 46px;
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
	@media (max-width: 600px) {
		.site-header { height: 64px; padding: 0 16px; }
		.site-header nav a { display: none; }
		.form-shell { padding: 28px 16px 52px; }
		.listing-type { grid-template-columns: 1fr; }
		.field-row { grid-template-columns: 1fr; }
	}
</style>
