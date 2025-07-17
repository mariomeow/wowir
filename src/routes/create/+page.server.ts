import { z } from "zod/v4"
import { superValidate } from "sveltekit-superforms"
import { zod4 } from "sveltekit-superforms/adapters"
import { fail, redirect, type Actions } from "@sveltejs/kit"
import { raids } from "$lib/data/raids"
import prisma from "$lib/server/prisma"

const createRaidSchema = z.object({
    raid: z.union([z.string(), z.undefined()]),
    instanceId: z.number().nonnegative().refine(val => raids.keys().toArray().includes(val)).default(-1),
    name: z.string().nonempty().max(100),
    max_sr: z.number().min(1).max(3).default(1),
    date: z.coerce.date().default(new Date())
})

export async function load({ locals }) {
    const form = await superValidate(zod4(createRaidSchema))

    return {
        user: locals.user,
        form
    }
}

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) redirect(303, "/")

        const form = await superValidate(request, zod4(createRaidSchema))

        if (!form.valid) return fail(400, { form })

        let raidId: string | undefined

        try {
            raidId = await prisma.$transaction(async (tx) => {
                const raid = await tx.raid.create({
                    data: {
                        name: form.data.name,
                        instanceId: form.data.instanceId,
                        startsAt: form.data.date,
                        hostId: locals.user.id
                    }
                })

                await tx.raidParticipation.create({
                    data: {
                        userId: locals.user.id,
                        raidId: raid.id
                    }
                })

                await tx.allTime.upsert({
                    where: {
                        userId_instanceId: {
                            userId: locals.user.id,
                            instanceId: form.data.instanceId
                        }
                    },
                    update: {
                        times_ran: {
                            increment: 1
                        }
                    },
                    create: {
                        instanceId: form.data.instanceId,
                        userId: locals.user.id
                    }
                })

                return raid.id
            })
        } catch (error) {
            console.error(error)
        }

        redirect(303, `/raid/${raidId}`)
    }
}