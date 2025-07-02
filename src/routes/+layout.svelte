<script lang="ts">
	import Nav from "$lib/components/Nav.svelte"
	import "$lib/style.css"

	let { children } = $props()
</script>

<main>
	<Nav />
	{@render children()}
</main>
