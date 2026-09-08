import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authenticationHandle } from './auth';

const protectedPrefixes = ['/dashboard', '/setup-profile'];

const authorizationHandle: Handle = async ({ event, resolve }) => {
  const isProtected = protectedPrefixes.some((prefix) => event.url.pathname === prefix || event.url.pathname.startsWith(`${prefix}/`));

  if (isProtected) {
    const session = await event.locals.auth();
    if (!session?.user) {
      const redirectTo = `${event.url.pathname}${event.url.search}`;
      throw redirect(303, `/login?redirectTo=${encodeURIComponent(redirectTo)}`);
    }
  }

  return resolve(event);
};

export const handle: Handle = sequence(authenticationHandle, authorizationHandle);
