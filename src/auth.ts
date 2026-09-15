import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { uuid } from '$lib/server/uuid';
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [Google],
	trustHost: true,
	session: { strategy: 'jwt' },
	pages: { signIn: '/login' },

	callbacks: {
		/** Upsert user into our DB on every Google sign-in. */
		async signIn({ account, profile }) {
			if (account?.provider !== 'google' || !profile?.sub) return true;

			const db = getDb();
			const googleId = account.providerAccountId;
			const email = (profile.email ?? '').toLowerCase().trim();
			const name = profile.name ?? 'Pembaca Tukarbuku';
			const avatarUrl = profile.picture ?? null;

			const rows = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.googleId, googleId));

			if (!rows.length) {
				await db.insert(users).values({
					id: uuid(),
					googleId,
					email,
					name,
					avatarUrl,
					profileCompleted: false,
				});
			} else {
				await db
					.update(users)
					.set({ name, avatarUrl })
					.where(eq(users.id, rows[0].id));
			}

			return true;
		},

		/** Put our internal user id into the JWT so we can read it in the session callback. */
		async jwt({ token, account, profile }) {
			if (account?.provider === 'google' && profile?.sub) {
				const db = getDb();
				const rows = await db
					.select({ id: users.id, profileCompleted: users.profileCompleted })
					.from(users)
					.where(eq(users.googleId, account.providerAccountId));

				if (rows[0]) {
					token.userId = rows[0].id;
					token.profileCompleted = rows[0].profileCompleted;
				}
			}
			return token;
		},

		/** Surface user fields on the client-side session. */
		async session({ token, session }) {
			if (token.userId) {
				session.user.id = token.userId as string;
				session.user.profileCompleted = (token.profileCompleted as boolean) ?? false;
			}
			return session;
		},
	},
});
