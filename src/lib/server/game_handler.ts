import type { Handle } from "@sveltejs/kit"

import { getSession, setSession, type SHSession } from "$lib/server/cookies"
import { verifyGameCode } from "$lib/server/firebase"

export const gameHandler: Handle = async ({ event, resolve }) => {
  const { cookies, locals } = event

  const session: SHSession = getSession(cookies)
  if (session.gameCode !== undefined) {
    try {
      locals.gameCode = await verifyGameCode(session.gameCode)
    } catch (e) {
      console.warn(`Invalid game code : ${session.gameCode}. ${e}`)
      delete session.gameCode
      setSession(cookies, session)
    }
  }

  return resolve(event)
}
