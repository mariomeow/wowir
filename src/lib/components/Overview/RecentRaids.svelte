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
				{#if !promiseData || promiseData.lastFive.length == 0}
					<p class="overview__placeholder">Your five recent raids will appear here.</p>
				{:else}
					{#each promiseData.lastFive as { instanceId, createdAt, id }}
						<a href={`/raid/${id}`}>
							<p class="stats__d">{raids.get(instanceId)?.name}</p>
							<p class="stats__n">{toDate(createdAt)}</p>
						</a>
					{/each}
				{/if}
			</div>
		</div>
	{/await}
</div>
