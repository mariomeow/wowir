<script lang="ts">
	import LucideX from "~icons/lucide/x"
	import LucideCheck from "~icons/lucide/check"
	import type { RAID_TYPE } from "$lib/types"
	import { fly } from "svelte/transition"
	import { raids } from "$lib/data/raids"
	import { SvelteMap } from "svelte/reactivity"
	import { onMount } from "svelte"
	import { superForm } from "sveltekit-superforms"

	function filterRaids(value?: string) {
		sgRaids.clear()

		raids.forEach((raid) => {
			if ((value && raid.name.toLowerCase().includes(value.toLowerCase())) || !value) {
				const attendanceRaids = sgRaids.get(raid.maxAttendance) ?? []

				sgRaids.set(raid.maxAttendance, [...attendanceRaids, raid])
			}
		})
	}

	let showRaidDropdown = $state<boolean>(false)

	const sgRaids = new SvelteMap<number, RAID_TYPE[]>()

	onMount(() => {
		filterRaids()
	})

	let { data } = $props()

	const { form, enhance } = superForm(data.form)
</script>

<svelte:document
	onclick={() => {
		if (showRaidDropdown && !raids.values().find((item) => item.name == $form.raid)) {
			showRaidDropdown = false
			$form.raid = undefined
			$form.instanceId = -1
			filterRaids()
		}
	}}
/>

<form method="post" class="create" use:enhance>
	<h1>New Raid</h1>
	<div class="create__select">
		<label for="raid">Raid</label>
		<div id="raid" class="create__select__wrapper">
			<input
				type="text"
				placeholder="Select a raid"
				bind:value={$form.raid}
				onclick={(e) => {
					e.stopPropagation()
					showRaidDropdown = true
				}}
				oninput={() => filterRaids($form.raid)}
			/>
			{#if $form.raid != undefined}
				<button
					onclick={(e) => {
						e.preventDefault()

						$form.raid = undefined
						$form.instanceId = -1
					}}><LucideX /></button
				>
			{/if}
			{#if showRaidDropdown}
				<div in:fly={{ y: -5, duration: 200 }} class="raid__selector">
					{#if sgRaids.size > 0}
						{#each sgRaids.entries() as [key, values]}
							<div class="separator">
								<hr />
								<span>{key}-man</span>
								<hr />
							</div>
							{#each values as { id, name }}
								<button
									class:selected={$form.raid == name}
									onclick={(e) => {
										e.preventDefault()

										$form.raid = name
										$form.instanceId = id
										showRaidDropdown = false
									}}
								>
									{#if $form.raid == name}
										<LucideCheck />
									{/if}
									{name}
								</button>
							{/each}
						{/each}
					{:else}
						<span class="empty">No raids found.</span>
					{/if}
				</div>
			{/if}
		</div>
	</div>
	<input type="text" name="instanceId" bind:value={$form.instanceId} />
	<div class="create__solo">
		<label for="raid_name">Raid name</label>
		<input
			id="raid_name"
			type="text"
			placeholder="Enter a raid title"
			maxlength="100"
			name="name"
			bind:value={$form.name}
		/>
	</div>
	<div class="create__split">
		<div class="input__group">
			<label for="sr">Max. SR per person</label>
			<input
				id="sr"
				type="number"
				placeholder="MAX SRS per person"
				min="1"
				max="3"
				bind:value={$form.max_sr}
				name="max_sr"
			/>
		</div>
		<div class="input__group">
			<label for="date">Start time</label>
			<input
				class="dateinput"
				id="date"
				type="date"
				placeholder="Pick a start date and time"
				name="date"
				bind:value={$form.date}
			/>
		</div>
	</div>
	<button type="submit">Create</button>
</form>

// hard reserve checkmark (FUTURE) // sr+ (FUTURE) // ban list (FUTURE) // COMMENTS (FUTURE)
