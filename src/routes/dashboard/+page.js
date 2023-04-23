import { token } from '../../acesstokenStore.js';

export async function load({ url }) {
	if (url.searchParams.has('access_token')) {
		const access_token = url.searchParams.get('access_token');
		token.set(access_token);
	}
	return {};
}
