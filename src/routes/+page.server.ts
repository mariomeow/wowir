import { getRequestEvent } from "$app/server"

async function getRaidData() {
    const { fetch } = getRequestEvent()

    const response = await fetch("/api/raids?pages=xd")

    const { myRaids, raidStats } = await response.json()

    return {
        myRaids,
        raidStats
    }
}

export async function load({ locals }) {
    return {
        user: locals.user,
        raidData: locals.user && getRaidData()
    }
}