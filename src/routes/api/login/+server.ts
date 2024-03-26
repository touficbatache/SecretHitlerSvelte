import { json } from "@sveltejs/kit"

import type { RequestHandler } from "./$types"

import { deleteSession, getSession, setSession } from "$lib/server/cookies"

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { token } = await request.json()
  if (token) {
    setSession(cookies, { ...getSession(cookies), token })
  } else {
    deleteSession(cookies)
  }
  return json({})
}
