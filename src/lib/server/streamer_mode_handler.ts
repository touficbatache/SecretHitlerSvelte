import type { Handle } from "@sveltejs/kit"

import { getSession, type SHSession } from "$lib/server/cookies"

export const streamerModeHandler: Handle = async ({ event, resolve }) => {
  const { cookies, locals } = event

  const session: SHSession = getSession(cookies)
  if (session.streamerModeEnabled === true) {
    locals.streamerModeEnabled = session.streamerModeEnabled
  }

  return resolve(event)
}
