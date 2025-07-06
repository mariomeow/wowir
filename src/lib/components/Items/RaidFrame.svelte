<script lang="ts">
	import LucideExternalLink from "~icons/lucide/external-link"
	import LucideLock from "~icons/lucide/lock"
	import LucideLockOpen from "~icons/lucide/lock-open"
	import { raids } from "$lib/data/raids"
	import { getTimeUntil, toDate } from "$lib/utils"
	import { goto } from "$app/navigation"

	let { raid } = $props()

	let raidInfo = $derived(raids.get(raid.instanceId))
	let starts = $derived(getTimeUntil(new Date(), raid.startsAt))
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
	<p class="overview__raid__title">
		{#if starts.months}
			{starts.months > 0 ? "Starts in" : "Started"}
			{Math.abs(starts.months)}
			{starts.months > 1
				? "months"
				: starts.months == 1
					? "month"
					: starts.months == -1
						? "month ago"
						: "months ago"}
		{:else if starts.days}
			{starts.days > 0 ? "Starts in" : "Started"}
			{Math.abs(starts.days)}
			{starts.days > 1
				? "days"
				: starts.days == 1
					? "day"
					: starts.days == -1
						? "day ago"
						: "days ago"}
		{:else if starts.hours}
			{starts.hours > 0 ? "Starts in" : "Started"}
			{Math.abs(starts.hours)}
			{starts.hours > 1
				? "hours"
				: starts.hours == 1
					? "hour"
					: starts.hours == -1
						? "hour ago"
						: "hours ago"}
		{:else if starts.minutes}
			{starts.minutes > 0 ? "Starts in" : "Started"}
			{Math.abs(starts.minutes)}
			{starts.minutes > 1
				? "minutes"
				: starts.minutes == 1
					? "minute"
					: starts.minutes == -1
						? "minute ago"
						: "minutes ago"}
		{:else if starts.seconds}
			{starts.seconds > 0 ? "Starts in" : "Started"}
			{Math.abs(starts.seconds)}
			{starts.seconds > 1
				? "seconds"
				: starts.seconds == 1
					? "second"
					: starts.seconds == -1
						? "second ago"
						: "seconds ago"}
		{:else}
			Starts now
		{/if}
	</p>
	<div class="overview__raid__split">
		<p class="overview__raid__createdAt">Created at: {toDate(raid.createdAt)}</p>
		<p class="overview__raid__createdAt">
			{raid._count.raidParticipations} / {raidInfo?.maxAttendance}
		</p>
	</div>
</div>
