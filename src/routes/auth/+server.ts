import { generateState } from "arctic"

export async function GET() {
    const state: string = generateState()


    return new Response(123)
}