import { json } from "@sveltejs/kit"

import type { RequestHandler } from "./$types"

import { getSession, setSession, type SHSession } from "$lib/server/cookies"

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { enabled } = await request.json()
  const session: SHSession = getSession(cookies)
  if (enabled === true) {
    session.streamerModeEnabled = enabled
  } else {
    delete session.streamerModeEnabled
  }
  setSession(cookies, session)
  return json({})
}
