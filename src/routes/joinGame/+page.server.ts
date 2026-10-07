import { redirect } from "@sveltejs/kit"

import type { PageServerLoad } from "./$types"

import * as ApiClient from "$lib/api_client"
import { type ApiAuth, type GameInfo, type GameInfoApiResponse } from "$lib/api_client"
import config from "$lib/server/config"

interface JoinGameResponse {
  joinableGames: GameInfo[]
  watchableGames: GameInfo[]
}

async function getActivePublicGames(auth: ApiAuth): Promise<JoinGameResponse> {
  const response: GameInfoApiResponse = await ApiClient.getActivePublicGames(auth)

  const joinableGames: GameInfo[] = []
  const watchableGames: GameInfo[] = []

  for (const gameInfo of response.success ?? []) {
    if (gameInfo.status === "waiting") {
      if (gameInfo.playerCount < 10) {
        joinableGames.push(gameInfo)
      } else {
        // TODO: for now, games that 1) are full and 2) haven't yet started, don't appear anywhere.
        //  Logically, they should be available to watch but they won't show because they're "waiting".
        //  I don't think it's a problem because there's just a small timeframe between a game being full
        //  then it being started.
      }
    } else {
      watchableGames.push(gameInfo)
    }
  }

  return {
    joinableGames: joinableGames.toReversed(), // Show oldest games first (people have been waiting for more time 🤷🏻‍♂️)
    watchableGames,
  }
}

export const load: PageServerLoad = ({ locals }) => {
  const { user } = locals

  if (!user) {
    redirect(302, "/login")
  }

  // Pass this request's credentials explicitly: server modules are shared by all requests.
  const response: Promise<JoinGameResponse> = getActivePublicGames({
    apiURL: config.apiURL,
    token: user.token,
  })

  return {
    response,
  }
}
