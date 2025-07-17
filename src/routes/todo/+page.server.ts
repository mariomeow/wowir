import { redirect } from '@sveltejs/kit'

export async function load({ locals }) {
    if (locals.user?.id != "361181982115495936") redirect(307, "/")

    return {
        user: locals.user
    }
}