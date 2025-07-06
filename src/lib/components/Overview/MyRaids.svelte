<script lang="ts">
	import RaidFrame from "../Items/RaidFrame.svelte"
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
			<p class="overview__placeholder">Your raids will appear here.</p>
		{:else}
			{#each promiseData.myRaids as raid}
				<RaidFrame {raid} />
			{/each}
		{/if}
	{/await}
</div>
