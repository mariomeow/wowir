<script lang="ts">
	import { raids } from "$lib/data/raids"
	import OverviewBox from "../Placeholders/OverviewBox.svelte"

	let { data } = $props()
</script>

<div class="overview__left__section">
	<h1 class="overview__h1">My Stats</h1>
	{#await data}
		<OverviewBox />
	{:then promiseData}
		<div class="overview__box">
			<p>All-Time</p>
			<div class="overview__stats">
				{#if !promiseData || promiseData.raidsStats.size == 0}
					<p class="overview__placeholder">Your raiding history will appear here.</p>
				{:else}
					{#each promiseData.raidsStats as [id, count]}
						<button>
							<p class="stats__d">{raids.get(id)?.name}</p>
							<p class="stats__n">{count}</p>
						</button>
					{/each}
				{/if}
			</div>
		</div>
	{/await}
</div>
