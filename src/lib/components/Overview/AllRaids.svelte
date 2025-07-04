<script lang="ts">
	import { raids } from "$lib/data/raids"
	import LineMdLoadingTwotoneLoop from "~icons/line-md/loading-twotone-loop"

	let { data } = $props()
</script>

<div class="overview__left__section">
	<h1 class="overview__h1">My Stats</h1>
	<div class="overview__box">
		{#await data}
			<div class="overview__loader">
				<LineMdLoadingTwotoneLoop />
			</div>
		{:then raidData}
			<p>All-Time</p>
			<div class="overview__stats">
				{#if raidData.raidsMap.size == 0}
					<p class="overview__placeholder">Your raiding history will appear here.</p>
				{:else}
					{#each raidData.raidsMap as [id, count]}
						<button>
							<p class="stats__d">{raids.get(id)?.name}</p>
							<p class="stats__n">{count}</p>
						</button>
					{/each}
				{/if}
			</div>
		{/await}
	</div>
</div>
