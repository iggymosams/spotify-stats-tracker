<script>
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	export let disabled = true;
	export let to;
	export let from;
</script>

<div class="flex flex-none flex-col items-center justify-center">
	<div class="flex items-center justify-evenly gap-4">
		{#if !disabled}
			<button
				on:click={() => {
					if (!disabled) {
						goto(from);
					}
				}}
				class="text-1xl rounded-full border-2 border-white p-2 px-5 text-white hover:bg-white hover:text-inherit"
				transition:fade>{' < '}</button
			>
			<button
				on:click={() => goto(to)}
				class="text-1xl rounded-full border-2 border-white p-2 px-5 text-white hover:bg-white hover:text-inherit"
				transition:fade>{' > '}</button
			>
		{/if}
	</div>
</div>
