import type { Handle } from "@sveltejs/kit"

import { verifyToken } from "$lib/server/firebase"
import type { User } from "$lib/user"

export const userHandler: Handle = async ({ event, resolve }) => {
  const { cookies, locals } = event

  const token = cookies.get("token")
  if (token !== undefined) {
    try {
      const decodedToken = await verifyToken(token)
      const { uid, name, phone_number } = decodedToken
      locals.user = { uid, name, phone_number, token } as User
    } catch (e) {
      console.warn(`Invalid token : ${token}. ${e}`)
      cookies.delete("token", { path: "/" })
    }
  }

  const response: Response = await resolve(event)

  // Here: modify response as needed, ex: add headers

  return response
}
