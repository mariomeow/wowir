import raidsData from "$lib/json/raids.json"

export const raids = new Map(raidsData.map(raid => [raid.id, raid]))