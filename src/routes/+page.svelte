<script lang="ts">
	import AllRaids from "$lib/components/Overview/AllRaids.svelte"
	import RecentRaids from "$lib/components/Overview/RecentRaids.svelte"

	let { data } = $props()
</script>

<div class="overview">
	<div class="overview__split">
		<div class="overview__left">
			<AllRaids data={data.raidData} />
			<RecentRaids data={data.raidData} />
		</div>
		<div class="overview__right">
			<h1 class="overview__h1">My Raids</h1>
			<div class="overview__right__boxes">
				<button class="overview__box">
					<p>XD</p>
				</button>
				<button class="overview__box">
					<p>XD</p>
				</button>
				<button class="overview__box">
					<p>XD</p>
				</button>
				<button class="overview__box">
					<p>XD</p>
				</button>
			</div>
		</div>
	</div>
</div>
