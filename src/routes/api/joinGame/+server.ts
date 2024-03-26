import { json } from "@sveltejs/kit"

import type { RequestHandler } from "./$types"

import { getSession, setSession, type SHSession } from "$lib/server/cookies"

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { code } = await request.json()
  const session: SHSession = getSession(cookies)
  if (code) {
    session.gameCode = code
  } else {
    delete session.gameCode
  }
  setSession(cookies, session)
  return json({})
}
