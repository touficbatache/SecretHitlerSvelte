import { redirect } from "@sveltejs/kit"

import type { PageLoad } from "./$types"

import * as ApiClient from "$lib/api_client"
import { type GameInfoApiResponse } from "$lib/api_client"

export const load: PageLoad = async ({ parent }) => {
  const { apiURL, user } = await parent()

  if (!user) {
    redirect(302, "/login")
  }

  const response: Promise<GameInfoApiResponse> = ApiClient.getGamesForSelf({
    apiURL,
    token: user.token,
  })

  return {
    response,
  }
}
