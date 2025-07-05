<script lang="ts">
	import OverviewBox from "../Placeholders/OverviewBox.svelte"
	let { data } = $props()
</script>

<h1 class="overview__h1">My Raids</h1>
<div class="overview__right__boxes">
	{#await data}
		{#each { length: 6 } as _}
			<OverviewBox />
		{/each}
	{:then promiseData}
		{#if !promiseData || promiseData.myRaids.length == 0}
			NEMA NICEG
		{:else}
			HAS DATA
		{/if}
	{/await}
</div>
