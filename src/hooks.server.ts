import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authenticationHandle } from './auth';

const protectedPrefixes = ['/dashboard', '/setup-profile'];

const authorizationHandle: Handle = async ({ event, resolve }) => {
	const session = await event.locals.auth();
	const path = event.url.pathname;

	// Gate all /dashboard and /setup-profile behind auth.
	const needsAuth = protectedPrefixes.some(
		(prefix) => path === prefix || path.startsWith(`${prefix}/`)
	);

	if (needsAuth && !session?.user) {
		throw redirect(303, `/login?redirectTo=${encodeURIComponent(path + event.url.search)}`);
	}

	// If logged in but profile incomplete, force setup (except on the setup page itself).
	if (session?.user && !session.user.profileCompleted && path !== '/setup-profile') {
		throw redirect(303, '/setup-profile');
	}

	return resolve(event);
};

export const handle: Handle = sequence(authenticationHandle, authorizationHandle);
