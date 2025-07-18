<script lang="ts">
	import resets from "$lib/data/resets"
	import type { RAID_TYPE } from "$lib/types"
	import { differenceInSeconds } from "date-fns"

	let { raid, currentDate }: { raid: RAID_TYPE; currentDate: Date } = $props()

	let seconds: number = $state<number>(differenceInSeconds(resets.get(raid.id)!, currentDate))

	const timeFields = $derived.by(() => {
		return {
			days: Math.floor(seconds / (60 * 60 * 24)),
			hours: Math.floor((seconds % (60 * 60 * 24)) / (60 * 60)),
			minutes: Math.floor((seconds % (60 * 60)) / 60),
			seconds: seconds % 60
		}
	})

	let timer: NodeJS.Timeout

	$effect(() => {
		timer = setInterval(() => {
			seconds -= 1
		}, 1000)

		return () => {
			clearInterval(timer)
		}
	})
</script>

<div class="reset__item" style={`background-image: url(images/raids/${raid.reference}.webp)`}>
	<div class="reset__item__shadow"></div>
	<div class="reset__item__data">
		<h1>{raid.name}</h1>
		<p>Resets every {raid.reset_days} days</p>
		<h2>{timeFields.days}d {timeFields.hours}h {timeFields.minutes}m {timeFields.seconds}s</h2>
	</div>
</div>
