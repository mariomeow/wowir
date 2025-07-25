import prisma from "$lib/server/prisma"
import { json } from "@sveltejs/kit"

export async function GET({ setHeaders, url, locals }) {
    if (!locals.user) return new Response(null)

    const page: number | null = Number(url.searchParams.get("page"))

    const allRaids = await prisma.raid.findMany({
        where: {
            raidParticipations: {
                some: {
                    userId: locals.user.id
                }
            }
        },
        select: {
            instanceId: true,
            name: true,
            startsAt: true,
            id: true,
            locked: true,
            host: {
                select: {
                    username: true,
                    id: true
                }
            },
            _count: {
                select: {
                    raidParticipations: true
                }
            }
        },
        orderBy: [
            { locked: "asc" },
            { startsAt: "desc" }
        ],
        take: 6,
        skip: !isNaN(page) ? Number(page) * 6 : 0
    })

    const raidStats = await prisma.allTime.findMany({
        where: {
            userId: locals.user.id
        },
        select: {
            instanceId: true,
            times_ran: true
        },
        orderBy: {
            times_ran: "desc"
        }
    })

    setHeaders({
        "Cache-Control": "no-cache"
    })

    return json({
        myRaids: allRaids,
        raidStats
    })
}