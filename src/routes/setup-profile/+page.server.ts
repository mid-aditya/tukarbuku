import { redirect, fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.user) throw redirect(303, '/login?redirectTo=/setup-profile');
	return { session };
};

const profileSchema = z.object({
	name: z.string().trim().min(1).max(120),
	city: z.string().trim().min(1).max(100),
	phone: z.string().trim().max(32).optional(),
});

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) throw redirect(303, '/login?redirectTo=/setup-profile');

		const data = await request.formData();
		const raw = {
			name: data.get('name'),
			city: data.get('city'),
			phone: data.get('phone') || undefined,
		};

		const parsed = profileSchema.safeParse(raw);
		if (!parsed.success) {
			return fail(422, { error: 'Data profil tidak valid. Pastikan nama dan kota sudah diisi.' });
		}

		const db = getDb();
		await db
			.update(users)
			.set({
				name: parsed.data.name,
				city: parsed.data.city,
				phone: parsed.data.phone ?? null,
				profileCompleted: true,
			})
			.where(eq(users.id, session.user.id));

		throw redirect(303, '/dashboard');
	},
};
