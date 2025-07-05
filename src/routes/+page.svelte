<script lang="ts">
	import MyRaids from "$lib/components/Overview/MyRaids.svelte"
	import RaidStats from "$lib/components/Overview/RaidStats.svelte"
	import RecentRaids from "$lib/components/Overview/RecentRaids.svelte"

	let { data } = $props()
</script>

<div class="overview">
	<div class="overview__split">
		<div class="overview__left">
			<RaidStats data={data.raidData} />
			<RecentRaids data={data.raidData} />
		</div>
		<div class="overview__right">
			<MyRaids data={data.raidData} />
		</div>
	</div>
</div>
