<script lang="ts">
	import { fade } from "svelte/transition"
	import { backOut } from "svelte/easing"
	import LucideLogIn from "~icons/lucide/log-in"
	import LucideHome from "~icons/lucide/home"
	import { onNavigate } from "$app/navigation"
	import { enhance } from "$app/forms"

	let { user, navState = $bindable() } = $props()

	onNavigate(() => {
		navState = null
	})

	let dropDownElement = $state<HTMLDivElement>()
</script>

<svelte:window
	onclick={(e) => {
		if (
			dropDownElement &&
			e.target != dropDownElement &&
			!dropDownElement.contains(e.target as HTMLElement)
		)
			navState = null
	}}
/>

<div
	class="dropdown"
	transition:fade={{ duration: 300, easing: backOut }}
	bind:this={dropDownElement}
>
	<div class="dropdown__top">
		<p>{user.username}</p>
	</div>
	<div class="dropdown__actions">
		<a href="/">Home Page <LucideHome /></a>
		<form action="/logout" method="post" use:enhance>
			<button type="submit">Log Out <LucideLogIn /></button>
		</form>
	</div>
</div>
