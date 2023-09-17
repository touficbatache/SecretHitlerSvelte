import type { Handle } from "@sveltejs/kit"

export const gameHandler: Handle = async ({ event, resolve }) => {
  const { cookies, locals } = event

  const code = cookies.get("gameCode")
  if (code !== undefined) {
    try {
      locals.gameCode = code as string
    } catch (e) {
      console.warn(`Invalid game code : ${code}. ${e}`)
      cookies.delete("gameCode", { path: "/" })
    }
  }

  const response: Response = await resolve(event)

  // Here: modify response as needed, ex: add headers

  return response
}
