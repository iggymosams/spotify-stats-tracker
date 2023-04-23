<script>
	import { onMount } from 'svelte';
	import { token } from '../../acesstokenStore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	import NavButtons from '../../components/navButtons.svelte';

	let recentlyPlayed;
	let hour = 0;
	let min = 0;
	let sec = 0;
	let disabled = true;

	async function getRecent() {
		hour = 0;
		min = 0;
		sec = 0;
		const accessToken = $token;
		if (!accessToken) goto('/');
		const res = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		const data = await res.json();
		recentlyPlayed = data;
		const time = recentlyPlayed.items.reduce((acc, item) => acc + item.track.duration_ms, 0);
		animateTime(time);
	}

	function resetURL() {
		$page.url.searchParams.delete('access_token');
		goto(`?${$page.url.searchParams.toString()}`);
	}

	async function animateTime(duration) {
		const totalSec = Math.floor((duration / 1000) % 60);
		const totalMinutes = Math.floor((duration / (1000 * 60)) % 60);
		const totalHours = Math.floor((duration / (1000 * 60 * 60)) % 24);
		const speed = 200;

		const animate = () => {
			if (totalSec > sec) sec = Math.ceil(sec + totalSec / speed);
			if (totalMinutes > min) min = Math.ceil(min + totalMinutes / speed);
			if (totalHours > hour) hour = Math.ceil(hour + totalHours / speed);

			if (totalSec === sec && totalMinutes === min && totalHours === hour) disabled = false;
			else setTimeout(animate, 10);
		};

		animate();
	}

	onMount(resetURL);
	onMount(getRecent);
</script>

<div class="flex min-h-screen flex-col p-4">
	<div class="flex flex-none flex-col items-center justify-center" transition:fade>
		<h1 class="text-center text-4xl font-bold text-green-500">Listen Time</h1>
	</div>

	<div class="flex grow flex-col items-center justify-start gap-6 pt-60" transition:fade>
		<div class="flex w-1/2 flex-col items-center text-center text-3xl text-green-500">
			<div class="flex w-full justify-around">
				<span><strong>{hour}</strong></span>
				<span><strong>{min}</strong></span>
				<span><strong>{sec}</strong></span>
			</div>

			<div class="flex w-full justify-around text-center">
				<span>Hours</span>
				<span>Mins</span>
				<span>Sec</span>
			</div>
		</div>

		<h6 class="text-ne text-center text-xl text-neutral-800">*Only last 50 songs</h6>
	</div>

	<NavButtons {disabled} to="/dashboard/top/tracks" from="/dashboard/top/artists" />
</div>
