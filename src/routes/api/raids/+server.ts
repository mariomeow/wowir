import prisma from "$lib/server/prisma"
import { json } from "@sveltejs/kit"

export async function GET({ setHeaders, url, locals }) {
    if (!locals.user) return new Response(null)

    const searchParam_page: string | null = url.searchParams.get("page")
    const page: number = Number(searchParam_page) || 0

    const myRaids = await prisma.raid.findMany({
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
        skip: page * 6
    })

    console.log(myRaids)

    setHeaders({
        "Cache-Control": "no-cache"
    })

    return json({
        myRaids,
        page
    })
}