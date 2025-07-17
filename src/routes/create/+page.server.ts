import { z } from "zod/v4"
import { superValidate } from "sveltekit-superforms"
import { zod4 } from "sveltekit-superforms/adapters"
import { fail, type Actions } from "@sveltejs/kit"
import { raids } from "$lib/data/raids"

const createRaidSchema = z.object({
    raid: z.union([z.string(), z.undefined()]),
    instanceId: z.number().nonnegative().refine(val => raids.keys().toArray().includes(val), {
        message: "NOPE"
    }).default(-1),
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
    default: async ({ request }) => {
        const form = await superValidate(request, zod4(createRaidSchema))

        console.log(form)

        if (!form.valid) return fail(400, { form })
    }
}