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
				{#if !promiseData || promiseData.raidStats.length == 0}
					<p class="overview__placeholder">Your raiding history will appear here.</p>
				{:else}
					{#each promiseData.raidStats as { instanceId, times_ran }}
						<button>
							<p class="stats__d">{raids.get(instanceId)?.name}</p>
							<p class="stats__n">{times_ran}</p>
						</button>
					{/each}
				{/if}
			</div>
		</div>
	{/await}
</div>
