import { redirect } from "@sveltejs/kit"

import type { PageServerLoad } from "./$types"

import * as ApiClient from "$lib/api_client"
import { type GameInfoApiResponse } from "$lib/api_client"
import config from "$lib/server/config"

export const load: PageServerLoad = ({ locals }) => {
  const { user } = locals

  if (!user) {
    redirect(302, "/login")
  }

  // Pass this request's credentials explicitly: server modules are shared by all requests.
  const response: Promise<GameInfoApiResponse> = ApiClient.getGamesForSelf({
    apiURL: config.apiURL,
    token: user.token,
  })

  return {
    response,
  }
}
