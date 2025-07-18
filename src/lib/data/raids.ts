import raidsData from "$lib/json/raids.json"

const raids = new Map(raidsData.map(raid => [raid.id, raid]))

export default raids