import type { LayoutServerLoad } from "./$types"

import type { User } from "$lib/user"

export const load: LayoutServerLoad = async ({
  locals,
}): Promise<{
  user?: User
  gameCode?: string
  lastUpdate: number
}> => {
  const { user, gameCode } = locals

  const lastUpdate = Date.now()

  return { user, gameCode, lastUpdate }
}
