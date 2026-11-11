import { error, redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { rateLimit } from '$lib/server/rate-limit';
import { listTransactionsForUser, transitionTransaction, TransactionError } from '$lib/server/transactions';
import { transactionActionSchema } from '$lib/validation/transaction';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.user?.id) throw redirect(303, '/login?redirectTo=/dashboard/transaksi');

	try {
		return { transactions: await listTransactionsForUser(session.user.id) };
	} catch (err) {
		console.error('[transaksi] gagal memuat daftar:', err);
		throw error(503, 'Database sedang tidak tersedia. Coba lagi sebentar lagi.');
	}
};

export const actions: Actions = {
	transition: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) throw redirect(303, '/login?redirectTo=/dashboard/transaksi');

		const limit = rateLimit(`transaction-action:${session.user.id}`, 20, 60_000);
		if (!limit.ok) {
			return fail(429, { message: 'Terlalu banyak aksi. Coba lagi sebentar lagi.' });
		}

		const data = await request.formData();
		const parsed = transactionActionSchema.safeParse({
			action: data.get('action')
		});
		const transactionId = String(data.get('transactionId') ?? '');
		if (!parsed.success || !/^[0-9a-f-]{36}$/i.test(transactionId)) {
			return fail(400, { message: 'Aksi transaksi tidak valid.' });
		}

		try {
			await transitionTransaction({
				transactionId,
				actorId: session.user.id,
				action: parsed.data.action
			});
		} catch (err) {
			if (err instanceof TransactionError) {
				return fail(err.code === 'forbidden' ? 403 : 400, { message: err.message });
			}
			throw err;
		}

		throw redirect(303, '/dashboard/transaksi');
	}
};
