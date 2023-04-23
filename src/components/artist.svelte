<script>
	import { fade } from 'svelte/transition';

	export let name;
	export let genres;
	export let img;
</script>

<div
	class="flex max-h-full w-1/2 flex-col rounded-lg bg-green-500 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] md:max-w-xl md:flex-row"
	transition:fade
>
	<img
		class="rounded-t-lg object-cover md:max-h-20 md:shrink-0 md:rounded-none md:rounded-l-lg"
		src={img}
		alt=""
	/>
	<div class="flex flex-col justify-start px-5">
		<h5 class="mb-2 text-xl font-medium">{name}</h5>
		<p class="text-base">{genres}</p>
	</div>
</div>
