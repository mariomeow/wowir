import prisma from "$lib/server/prisma"

async function getAllRaids(userId: string) {
    const allRaids = await prisma.raid.findMany({
        where: {
            raidParticipations: {
                some: {
                    userId
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
        ]
    })

    const raidStats = await prisma.allTime.findMany({
        where: {
            userId
        },
        select: {
            instanceId: true,
            times_ran: true
        },
        orderBy: {
            times_ran: "desc"
        }
    })

    return {
        myRaids: allRaids,
        raidStats
    }
}

export async function load({ locals }) {
    return {
        user: locals.user,
        raidData: locals.user && getAllRaids(locals.user.id)
    }
}