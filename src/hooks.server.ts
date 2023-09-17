import type { Handle } from "@sveltejs/kit"

import { sequence } from "@sveltejs/kit/hooks"
import { gameHandler } from "$lib/server/game_handler"
import { userHandler } from "$lib/server/user_handler"

export const handle: Handle = sequence(
  userHandler,
  gameHandler,
  // async ({ event, resolve }) => {
  //   return await resolve(event)
  // },
)
