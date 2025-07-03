import { generateState } from "arctic"
import { discord } from "$lib/server/authProviders"
import { redirect } from "@sveltejs/kit"

export async function GET({ cookies }) {
    const state: string = generateState()

    const url = discord.createAuthorizationURL(state, null, ["identify"])

    cookies.set("state", state, {
        secure: true,
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10
    })

    redirect(307, url)
} 