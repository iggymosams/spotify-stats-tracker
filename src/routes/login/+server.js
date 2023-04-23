import { URLSearchParams } from 'url';
import { SPOTIFY_CLIENT_ID } from '$env/static/private';

export function GET() {
	const state = getRandomString(16);
	const scope = 'user-read-private user-read-email user-read-recently-played user-top-read';
	const url = 'https://accounts.spotify.com/authorize';
	const redirect_uri = 'http://127.0.0.1:5173/auth/';
	const params = new URLSearchParams({
		response_type: 'code',
		client_id: SPOTIFY_CLIENT_ID,
		scope: scope,
		redirect_uri: redirect_uri,
		state: state
	});
	return Response.redirect(`${url}?${params.toString()}`);
}

function getRandomString(length) {
	let result = '';
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwyxz0123456789';
	const charsLenth = chars.length;
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * charsLenth));
	}
	return result;
}
