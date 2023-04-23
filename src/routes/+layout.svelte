<script>
	import '../app.css';
</script>

<slot />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.neutral.900);
	}
</style>
