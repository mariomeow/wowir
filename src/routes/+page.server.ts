import { getRequestEvent } from "$app/server"
import prisma from "$lib/server/prisma"

async function getRaidData() {
    const { locals, fetch } = getRequestEvent()

    const [{ myRaids, page }, [recentRaids, raidStats]] = await Promise.all([
        fetch("/api/raids").then(response => response.json()),
        prisma.$transaction([
            prisma.raid.findMany({
                where: {
                    raidParticipations: {
                        some: {
                            userId: locals.user?.id
                        }
                    }
                },
                select: {
                    instanceId: true,
                    id: true,
                    startsAt: true
                },
                orderBy: [
                    { locked: "asc" },
                    { startsAt: "desc" }
                ],
                take: 6,
            }),
            prisma.allTime.findMany({
                where: {
                    userId: locals.user?.id
                },
                select: {
                    instanceId: true,
                    times_ran: true
                },
                orderBy: {
                    times_ran: "desc"
                }
            })
        ])
    ])

    return {
        myRaids,
        recentRaids,
        raidStats,
        page
    }
}

export async function load({ locals }) {
    return {
        user: locals.user,
        raidData: locals.user && getRaidData()
    }
}