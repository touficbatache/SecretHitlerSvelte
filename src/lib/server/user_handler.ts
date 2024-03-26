import type { UserRecord } from "firebase-admin/auth"
import type { Handle } from "@sveltejs/kit"

import { deleteSession, getSession, type SHSession } from "$lib/server/cookies"
import { verifyIdToken } from "$lib/server/firebase"
import type { User } from "$lib/user"

export const userHandler: Handle = async ({ event, resolve }) => {
  const { cookies, locals } = event

  const session: SHSession = getSession(cookies)
  if (session.token !== undefined) {
    try {
      const decodedToken: UserRecord = await verifyIdToken(session.token)
      const { uid, displayName, phoneNumber } = decodedToken
      locals.user = { uid, name: displayName, phoneNumber, token: session.token } as User
    } catch (e) {
      console.warn(`Invalid token : ${session.token}. ${e}`)
      deleteSession(cookies)
    }
  }

  return resolve(event)
}
