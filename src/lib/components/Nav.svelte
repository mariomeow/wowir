<script lang="ts">
	import { page } from "$app/state"

	let pathname = $derived<string>(page.url.pathname)
	let user = $derived(page.data.user)
</script>

<nav>
	<div class="nav-top">
		<a class="logo" href="/">WOWIR</a>
		<div class="nav-top-right">
			<a href="/feedback">Feedback</a>
			{#if user}
				<button>
					<img
						src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
						alt={user.username}
					/>
				</button>
			{/if}
		</div>
	</div>
	<div class="links">
		<a href="/" aria-current={pathname == "/" && "page"}>Overview</a>
		<a href="/create" aria-current={pathname == "/create" && "page"}>Create Raid</a>
		<a href="/raids" aria-current={pathname == "/raids" && "page"}>My Raids</a>
		<a href="/resets" aria-current={pathname == "/resets" && "page"}>Raid Resets</a>
	</div>
</nav>
