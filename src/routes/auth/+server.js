import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, env } from '$env/static/private';

export async function GET({ url }) {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const redirect_uri =
		env === 'DEV'
			? 'http://127.0.0.1:5173/auth/'
			: 'https://iggy-spotify-stats-tracker.vercel.app/auth/';

	if (state === null) {
		return Response.redirect('/');
	} else {
		try {
			const auth = new Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString(
				'base64'
			);
			const response = await fetch('https://accounts.spotify.com/api/token', {
				method: 'POST',
				headers: {
					Authorization: `Basic ${auth}`,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`
			});
			const data = await response.json();
			const dashboardUrl = new URL(
				'/dashboard',
				env === 'DEV' ? 'http://127.0.0.1:5173/' : 'https://iggy-spotify-stats-tracker.vercel.app/'
			);
			dashboardUrl.searchParams.set('access_token', data.access_token);
			return Response.redirect(dashboardUrl.toString());
		} catch (error) {
			console.error(error);
			return new Response(error);
		}
	}
}
