import { json } from "@sveltejs/kit"

import { deleteSession, getSession, setSession } from "$lib/server/cookies"

import type { RequestHandler } from "./$types"

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { token } = await request.json()
  if (token) {
    setSession(cookies, { ...getSession(cookies), token })
  } else {
    deleteSession(cookies)
  }
  return json({})
}
