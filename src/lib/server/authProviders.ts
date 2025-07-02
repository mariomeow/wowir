import { DISCORD_CLIENT_SECRET } from "$env/static/private"
import { PUBLIC_DISCORD_CLIENT_ID, PUBLIC_URL } from "$env/static/public"
import { Discord } from "arctic"

export const discord = new Discord(PUBLIC_DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, `${PUBLIC_URL}/auth/callback`)