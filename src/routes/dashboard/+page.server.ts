import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDashboardSummary } from '$lib/server/books';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.user) throw redirect(303, '/login?redirectTo=/dashboard');

	try {
		const summary = await getDashboardSummary(session.user.id);
		return { session, summary, dbAvailable: true };
	} catch (err) {
		console.error('[dashboard] gagal memuat ringkasan:', err);
		return {
			session,
			summary: { activeListings: 0, pendingOffers: 0, unreadMessages: 0, recentListings: [] },
			dbAvailable: false
		};
	}
};
