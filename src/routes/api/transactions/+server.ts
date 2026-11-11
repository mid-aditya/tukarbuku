import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { rateLimit } from '$lib/server/rate-limit';
import { proposeTransaction, TransactionError } from '$lib/server/transactions';
import { transactionProposalSchema } from '$lib/validation/transaction';

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth();
	if (!session?.user?.id) throw error(401, 'Unauthorized');

	const limit = rateLimit(`transaction-post:${session.user.id}`, 5, 60_000);
	if (!limit.ok) {
		return json(
			{ message: 'Terlalu banyak ajuan transaksi. Coba lagi sebentar lagi.' },
			{ status: 429, headers: { 'Retry-After': String(limit.resetInSec) } }
		);
	}

	const raw = (await request.json().catch(() => null)) as unknown;
	const parsed = transactionProposalSchema.safeParse(raw);
	if (!parsed.success) {
		throw error(400, parsed.error.issues[0]?.message ?? 'Input tidak valid');
	}

	try {
		const result = await proposeTransaction({
			conversationId: parsed.data.conversationId,
			buyerId: session.user.id
		});
		return json(result);
	} catch (err) {
		if (err instanceof TransactionError) {
			const status = err.code === 'forbidden' ? 403 : err.code === 'unavailable' ? 409 : 400;
			throw error(status, err.message);
		}
		throw err;
	}
};
