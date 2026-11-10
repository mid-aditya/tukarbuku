/**
 * Client-side favorites state shared by every book card.
 * Loads once per session, then toggles optimistically against /api/favorites.
 */
class FavoritesStore {
	ids = $state<Set<string>>(new Set());
	#loaded = false;
	#loading = false;
	#pending = new Set<string>();

	has(id: string) {
		return this.ids.has(id);
	}

	async load() {
		if (this.#loaded || this.#loading) return;
		this.#loading = true;
		try {
			const res = await fetch('/api/favorites');
			if (res.ok) {
				const data = (await res.json()) as { ids?: string[] };
				this.ids = new Set(data.ids ?? []);
			}
		} catch {
			// Transient failure: stay empty and retry on the next page load.
		} finally {
			this.#loading = false;
			this.#loaded = true;
		}
	}

	reset() {
		this.ids = new Set();
		this.#loaded = false;
	}

	async toggle(id: string): Promise<'added' | 'removed' | 'auth' | 'error'> {
		if (this.#pending.has(id)) return 'error';

		this.#pending.add(id);
		const previous = this.ids;
		const next = new Set(previous);
		const wasSaved = next.has(id);

		if (wasSaved) next.delete(id);
		else next.add(id);
		this.ids = next;

		try {
			const res = await fetch('/api/favorites', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ bookId: id })
			});

			if (res.status === 401) {
				this.ids = previous;
				return 'auth';
			}
			if (!res.ok) {
				this.ids = previous;
				return 'error';
			}

			const data = (await res.json()) as { favorited?: boolean };
			const saved = Boolean(data.favorited);
			const synced = new Set(this.ids);

			if (saved) synced.add(id);
			else synced.delete(id);
			this.ids = synced;

			return saved ? 'added' : 'removed';
		} catch {
			this.ids = previous;
			return 'error';
		} finally {
			this.#pending.delete(id);
		}
	}
}

export const favorites = new FavoritesStore();
