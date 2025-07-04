<script lang="ts">
	import { raids } from "$lib/data/raids"
	import { toDate } from "$lib/utils"
	import LineMdLoadingTwotoneLoop from "~icons/line-md/loading-twotone-loop"

	let { data } = $props()
</script>

<div class="overview__left__section">
	<h1 class="overview__h1">Recent Raids</h1>
	<div class="overview__box">
		{#await data}
			<div class="overview__loader">
				<LineMdLoadingTwotoneLoop />
			</div>
		{:then raidData}
			<div class="overview__stats">
				{#if !raidData || raidData.lastFive.length == 0}
					<p class="overview__placeholder">Your five recent raids will appear here.</p>
				{:else}
					{#each raidData.lastFive as { instanceId, createdAt, id }}
						<a href={`/raid/${id}`}>
							<p class="stats__d">{raids.get(instanceId)?.name}</p>
							<p class="stats__n">{toDate(createdAt)}</p>
						</a>
					{/each}
				{/if}
			</div>
		{/await}
	</div>
</div>
