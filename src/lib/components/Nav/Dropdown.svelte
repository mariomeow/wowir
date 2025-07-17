<script lang="ts">
	import { fade } from "svelte/transition"
	import { backOut } from "svelte/easing"
	import LucideLogIn from "~icons/lucide/log-in"
	import LucideHome from "~icons/lucide/home"
	import { onNavigate } from "$app/navigation"

	let { user, navState = $bindable() } = $props()

	onNavigate(() => {
		navState = null
	})

	let dropDownElement = $state<HTMLDivElement>()
</script>

<svelte:document
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
	class="dropdown__element"
	transition:fade={{ duration: 300, easing: backOut }}
	bind:this={dropDownElement}
>
	<div class="dropdown__top">
		<p>{user.username}</p>
	</div>
	<div class="dropdown__actions">
		<a href="/">Home Page <LucideHome /></a>
		<form
			action="/logout"
			method="post"
			onsubmit={(e) => {
				const formElement = e.currentTarget as HTMLFormElement
				const submitButton = e.submitter as HTMLButtonElement
				const span = formElement.querySelector("span") as HTMLSpanElement

				submitButton.disabled = true
				span.textContent = "Logging out..."
			}}
		>
			<button type="submit"><span>Log Out</span> <LucideLogIn /></button>
		</form>
	</div>
</div>
