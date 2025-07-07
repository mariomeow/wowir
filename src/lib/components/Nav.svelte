<script lang="ts">
	import { page } from "$app/state"
	import LucideBookOpen from "~icons/lucide/book-open"
	import IcBaselineDiscord from "~icons/ic/baseline-discord"
	import Dropdown from "./Nav/Dropdown.svelte"

	let user = $derived(page.data.user)
	let pathname = $derived<string>(page.url.pathname)

	let navState = $state<"dropdown" | null>(null)
</script>

<nav>
	<div class="nav-top">
		<a class="logo" href="/">WOWIR</a>
		<div class="nav-top-right">
			<a href="/feedback">Feedback</a>
			<a class="a__icon" href="/changes"><LucideBookOpen /></a>
			{#if user}
				<div class="nav_button_wrapper">
					<button
						onclick={(e) => {
							e.stopPropagation()
							navState = navState == "dropdown" ? null : "dropdown"
						}}
					>
						<img
							src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
							alt={user.username}
						/>
					</button>
					{#if navState == "dropdown"}
						<Dropdown {user} bind:navState />
					{/if}
				</div>
			{:else}
				<a class="authButton" href="/auth">Login with <IcBaselineDiscord /></a>
			{/if}
		</div>
	</div>
	<div class="links">
		<a href="/" aria-current={pathname == "/" && "page"}>Overview</a>
		<a href="/create" aria-current={pathname == "/create" && "page"}>Create a Raid</a>
		<a href="/raids" aria-current={pathname == "/raids" && "page"}>My Raids</a>
		<a href="/resets" aria-current={pathname == "/resets" && "page"}>Raid Resets</a>
		<a href="/faq" aria-current={pathname == "/faq" && "page"}>FAQ</a>
	</div>
</nav>
