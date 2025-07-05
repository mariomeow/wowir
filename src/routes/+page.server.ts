import prisma from "$lib/server/prisma"

async function getAllRaids(userId: string) {
    const allRaids = await prisma.raid.findMany({
        where: {
            raidParticipations: {
                some: {
                    userId: "123123"
                }
            }
        },
        select: {
            instanceId: true,
            createdAt: true,
            id: true,
            locked: true,
            _count: {
                select: {
                    raidParticipations: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const raidsStats = new Map()

    allRaids.forEach(raid => {
        raidsStats.set(raid.instanceId, raidsStats.get(raid.instanceId) ? raidsStats.get(raid.instanceId) + 1 : 1)
    })

    return {
        myRaids: allRaids,
        raidsStats,
        lastFive: allRaids.slice(0, 5)
    }
}

export async function load({ locals }) {
    return {
        user: locals.user,
        raidData: locals.user && getAllRaids(locals.user.id)
    }
}