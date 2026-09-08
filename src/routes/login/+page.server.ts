import { signIn } from '../../auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => ({
  redirectTo: url.searchParams.get('redirectTo') ?? '/dashboard',
});

export const actions: Actions = { default: signIn };
