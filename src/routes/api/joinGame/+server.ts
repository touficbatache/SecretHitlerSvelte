import { json } from "@sveltejs/kit"

import type { RequestHandler } from "./$types"

export const POST: RequestHandler = async ({ request, cookies }) => {
  const payload = await request.json()
  const code = payload.code
  if (code) {
    cookies.set("gameCode", code, {
      path: "/",
      httpOnly: true,
    })
  } else {
    cookies.delete("gameCode", { path: "/" })
  }
  return json({})
}
