import { json } from "@sveltejs/kit"

import type { RequestHandler } from "./$types"

export const POST: RequestHandler = async ({ request, cookies }) => {
  const payload = await request.json()
  const token = payload.token
  if (token) {
    cookies.set("token", token, {
      path: "/",
      httpOnly: true,
    })
  } else {
    cookies.delete("token", { path: "/" })
    cookies.delete("gameCode", { path: "/" })
  }
  return json({})
}
