<script lang="ts">
	import { raids } from "$lib/data/raids"
	import { toDate } from "$lib/utils"
	import OverviewBox from "../Placeholders/OverviewBox.svelte"

	let { data } = $props()
</script>

<div class="overview__left__section">
	<h1 class="overview__h1">Recent Raids</h1>
	{#await data}
		<OverviewBox />
	{:then promiseData}
		<div class="overview__box">
			<div class="overview__stats">
				{#if !promiseData || promiseData.myRaids.length == 0}
					<p class="overview__placeholder">Your five recent raids will appear here.</p>
				{:else}
					{#each promiseData.myRaids.slice(0, 5) as { instanceId, id, startsAt }}
						<a href={`/raid/${id}`}>
							<p class="stats__d">{raids.get(instanceId)?.name}</p>
							<p class="stats__n">{toDate(startsAt)}</p>
						</a>
					{/each}
				{/if}
			</div>
		</div>
	{/await}
</div>
