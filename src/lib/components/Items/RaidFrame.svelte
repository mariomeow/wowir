<script lang="ts">
	import LucideExternalLink from "~icons/lucide/external-link"
	import LucideLock from "~icons/lucide/lock"
	import LucideLockOpen from "~icons/lucide/lock-open"
	import { raids } from "$lib/data/raids"
	import { toDate } from "$lib/utils"
	import { goto } from "$app/navigation"

	let { raid } = $props()

	let raidInfo = $derived(raids.get(raid.instanceId))
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="overview__box overview__raid"
	onclick={() => {
		goto(`/raid/${raid.id}`)
	}}
>
	<div class="overview__header">
		<div class="overview__header__left">
			<img
				src={`/images/raids/${raidInfo?.reference}.webp`}
				alt={raidInfo?.name}
				draggable="false"
			/>
			<div class="overview__header__titles">
				<p>{raid.name}</p>
				<p>{raidInfo?.name}</p>
			</div>
		</div>
		<div class="overview__header__right">
			{#if raid.locked}
				<LucideLock class="locked" />
			{:else}
				<LucideLockOpen class="unlocked" />
			{/if}
		</div>
	</div>
	<a class="overview__raid__host" href={`discord:///users/${raid.host.id}`}
		>{raid.host.username} <LucideExternalLink /></a
	>
	<p class="overview__raid__title">gasgas</p>
	<div class="overview__raid__split">
		<p class="overview__raid__createdAt">{toDate(raid.createdAt)}</p>
		<p class="overview__raid__createdAt">
			{raid._count.raidParticipations} / {raidInfo?.maxAttendance}
		</p>
	</div>
</div>
