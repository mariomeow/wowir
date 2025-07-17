import { redirect } from "@sveltejs/kit"

export async function load({ locals }) {
    if (!locals.user?.isAdmin) redirect(307, "/")

    return {
        user: locals.user
    }
}