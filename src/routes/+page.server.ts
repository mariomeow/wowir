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
            createdAt: true,
            name: true,
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
            { createdAt: "desc" }
        ]
    })

    const raidsStats = new Map()

    allRaids.forEach(raid => {
        raidsStats.set(raid.instanceId, raidsStats.get(raid.instanceId) ? raidsStats.get(raid.instanceId) + 1 : 1)
    })

    return {
        myRaids: allRaids,
        raidsStats
    }
}

export async function load({ locals }) {
    return {
        user: locals.user,
        raidData: locals.user && getAllRaids(locals.user.id)
    }
}