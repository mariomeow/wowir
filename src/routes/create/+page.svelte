<script lang="ts">
	import LucideX from "~icons/lucide/x"
	import LucideCheck from "~icons/lucide/check"
	import type { RAID_FORM_INPUTS } from "$lib/types"
	import { fly } from "svelte/transition"
	import { raids } from "$lib/data/raids"

	const formInputs = $state<RAID_FORM_INPUTS>({
		raid: ""
	})

	const sgRaids = new Map()

	raids.forEach((raid) => {
		const categoryRaids: (typeof raid)[] = sgRaids.get(raid.maxAttendance) ?? []

		if (!categoryRaids.includes(raid)) sgRaids.set(raid.maxAttendance, [...categoryRaids, raid])
	})

	let showRaidDropdown = $state<boolean>(false)
	let raidDropdownParent = $state<HTMLDivElement | undefined>()
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
