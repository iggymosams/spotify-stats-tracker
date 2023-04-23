<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import Track from '../../../../components/track.svelte';
	import { token } from '../../../../acesstokenStore';
	import NavButtons from '../../../../components/navButtons.svelte';

	const songs = writable([]);
	let disabled = true;

	async function fetchTracks() {
		const limit = 5;
		const accessToken = $token;

		if (!accessToken) {
			goto('/');
			return;
		}

		const res = await fetch(
			`https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=long_term`,
			{
				headers: {
					Authorization: 'Bearer ' + accessToken
				}
			}
		);
		const data = await res.json();

		for (let i = 0; i < limit; i++) {
			const t = data.items[i];
			const artists = t.artists.map((artist) => artist.name).join(', ');
			songs.update((s) => [
				...s,
				{
					name: t.name,
					artist: artists,
					img: t.album.images[1].url
				}
			]);
			await new Promise((resolve) => setTimeout(resolve, 500));
		}

		disabled = false;
	}

	onMount(fetchTracks);
</script>

<svelte:head>
	<title>Top Tracks | Spotify Stats</title>
</svelte:head>
<div class="flex min-h-screen flex-col p-4">
	<div class="flex flex-none flex-col items-center justify-center" transition:fade>
		<h1 class="text-center text-4xl font-bold text-green-500">Top Tracks</h1>
	</div>
	<div class="flex grow flex-col items-center justify-start gap-6 py-4" transition:fade>
		{#each $songs as { artist, name, img }}
			<Track {artist} {name} {img} />
		{/each}
	</div>
	<NavButtons {disabled} to="/dashboard/top/artists" from="/dashboard" />
</div>
