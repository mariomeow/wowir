<script lang="ts">
	import "$lib/style.css"
	import Nav from "$lib/components/Nav.svelte"

	let { children } = $props()
</script>

<Nav />
<main>
	{@render children()}
</main>
