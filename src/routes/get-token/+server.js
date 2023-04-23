import { token } from '../../acesstokenStore.js';

export function GET() {
	console.log(token);
	// const accessToken = $token; // get the access token from the token object
	return new Response(JSON.stringify({ access_token: token }), {
		headers: { 'Content-Type': 'application/json' }
	});
}
