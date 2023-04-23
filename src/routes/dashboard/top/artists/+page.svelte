<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import { token } from '../../../../acesstokenStore';
	import Artist from '../../../../components/artist.svelte';
	import NavButtons from '../../../../components/navButtons.svelte';

	const artists = writable([]);
	const uppers = ['uk', 'r&b', 'nyc'];
	const lowers = ['and'];

	function titleCase(arr) {
		// Max number of genres allowed in string is 5 so it doesn't get crowded
		if (arr.length === 0) {
			return 'Unknown';
		}

		const shortenedArr = arr.slice(0, 5);

		return shortenedArr.reduce((str, genre) => {
			const arrGenre = genre.split(' ');

			const fixedGenre = arrGenre
				.map((word) => {
					if (uppers.includes(word)) {
						return word.toUpperCase();
					}

					if (lowers.includes(word)) {
						return word;
					}

					const firstLetter = word[0].toUpperCase();
					const remaining = word.slice(1);

					return firstLetter + remaining;
				})
				.join(' ');

			if (str === '') {
				return fixedGenre;
			}

			return `${str}, ${fixedGenre}`;
		}, '');
	}

	async function getTracks() {
		const limit = 5;
		const accessToken = $token;

		if (!accessToken) {
			goto('/');
		}

		const res = await fetch(
			`https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=long_term`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		);

		const data = await res.json();

		for (let index = 0; index < limit; index++) {
			const { name, genres, images } = data.items[index];

			artists.update((s) => [
				...s,
				{
					name,
					genres: titleCase(genres),
					img: images[1].url
				}
			]);

			await new Promise((resolve) => setTimeout(resolve, 500));
		}
	}

	onMount(getTracks);
</script>

<svelte:head>
	<title>Top Artists | Spotify Stats</title>
</svelte:head>
<div class="flex min-h-screen flex-col p-4">
	<div class="flex flex-none flex-col items-center justify-center" transition:fade>
		<h1 class="text-center text-4xl font-bold text-green-500">Top Artists</h1>
	</div>
	<div class="flex grow flex-col items-center justify-start gap-6 py-4" transition:fade>
		{#each $artists as { genres, name, img }, index}
			<Artist {genres} {name} {img} />
		{/each}
	</div>
	<NavButtons disabled={$artists.length < 5} to="/dashboard" from="/dashboard/top/tracks" />
</div>
