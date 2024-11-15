import type { PageServerLoad } from "./$types"

import * as ApiClient from "$lib/api_client"
import { type GameinfoApiResponse } from "$lib/api_client"

export const load: PageServerLoad = async () => {
  const response: GameinfoApiResponse = await ApiClient.getGamesForSelf()

  return {
    games: response.success,
  }
}
