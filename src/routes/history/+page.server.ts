import type { PageServerLoad } from "./$types"

import * as ApiClient from "$lib/api_client"
import { type GameInfoApiResponse } from "$lib/api_client"

export const load: PageServerLoad = () => {
  const response: Promise<GameInfoApiResponse> = ApiClient.getGamesForSelf()

  return {
    response,
  }
}
