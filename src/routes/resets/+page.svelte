<script lang="ts">
	import ResetItem from "$lib/components/Items/ResetItem.svelte"
	import servers from "$lib/data/servers"
	import raids from "$lib/data/raids"

	let server = $state<string>(servers[0])
	const currentDate: Date = new Date()
</script>

<div class="resets">
	<select bind:value={server}>
		{#each servers as server}
			<option value={server}>{server}</option>
		{/each}
	</select>
	{#if server == "Nordanaar"}
		<div class="reset__group">
			{#each raids
				.values()
				.toArray()
				.filter((item) => item.reset_days != 0)
				.sort((a, b) => b.reset_days - a.reset_days) as raid}
				<ResetItem {raid} {currentDate} />
			{/each}
		</div>
	{:else}
		<div class="reset__group">
			{#each raids
				.values()
				.toArray()
				.filter((item) => item.reset_days != 0)
				.sort((a, b) => b.reset_days - a.reset_days) as raid}
				<ResetItem {raid} {currentDate} />
			{/each}
		</div>
	{/if}
</div>
