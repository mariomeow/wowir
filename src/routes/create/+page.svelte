<script lang="ts">
	import LucideX from "~icons/lucide/x"
	import LucideCheck from "~icons/lucide/check"
	import type { RAID_FORM_INPUTS, RAID_TYPE } from "$lib/types"
	import { fly } from "svelte/transition"
	import { raids } from "$lib/data/raids"
	import { SvelteMap } from "svelte/reactivity"
	import { onMount } from "svelte"

	function filterRaids(value?: string) {
		sgRaids.clear()

		raids.forEach((raid) => {
			if ((value && raid.name.toLowerCase().includes(value.toLowerCase())) || !value) {
				const attendanceRaids = sgRaids.get(raid.maxAttendance) ?? []

				sgRaids.set(raid.maxAttendance, [...attendanceRaids, raid])
			}
		})
	}

	const formInputs = $state<RAID_FORM_INPUTS>({
		raid: ""
	})

	let showRaidDropdown = $state<boolean>(false)
	let raidDropdownParent = $state<HTMLDivElement | undefined>()

	const sgRaids = new SvelteMap<number, RAID_TYPE[]>()

	onMount(() => {
		filterRaids()
	})
</script>

<svelte:document
	onclick={(e) => {
		if (
			raidDropdownParent &&
			e.target != raidDropdownParent &&
			!raidDropdownParent.contains(e.target as HTMLElement)
		) {
			showRaidDropdown = false
		}
	}}
/>

<form action="/?create" method="post" class="create">
	<h1>New Raid</h1>
	<div class="create__select">
		<label for="raid">Raid</label>
		<div class="create__select__wrapper" bind:this={raidDropdownParent}>
			<input
				id="raid"
				type="text"
				placeholder="Select a raid"
				bind:value={formInputs.raid}
				onclick={() => {
					showRaidDropdown = true
				}}
				oninput={() => filterRaids(formInputs.raid)}
			/>
			{#if formInputs.raid != ""}
				<button
					onclick={(e) => {
						e.preventDefault()

						formInputs.raid = ""
					}}><LucideX /></button
				>
			{/if}
			{#if showRaidDropdown}
				<div transition:fly={{ y: -5, duration: 200 }} class="raid__selector">
					{#if sgRaids.size > 0}
						{#each sgRaids.entries() as [key, values]}
							<div class="separator">
								<hr />
								<span>{key}-man</span>
								<hr />
							</div>
							{#each values as { id, name, maxAttendance }}
								<button
									class:selected={formInputs.raid == name}
									onclick={(e) => {
										e.preventDefault()

										formInputs.raid = name
										showRaidDropdown = false
									}}
								>
									{#if formInputs.raid == name}
										<LucideCheck />
									{/if}
									{name}
								</button>
							{/each}
						{/each}
					{/if}
				</div>
			{/if}
		</div>
	</div>
	<input type="text" placeholder="Enter a raid title" />
	<div class="create__split">
		<input type="number" />
		<input type="date" />
		<input type="time" />
	</div>
	<div class="create__split">
		<input type="text" placeholder="MAX SRS per person" />
	</div>
	// hard reserve checkmark // sr+ // ban list
</form>
