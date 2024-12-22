import { invalidateAll } from "$app/navigation"
import type { GameVisibility } from "$lib/game_data"

export interface CodeResponse {
  code: string
}

export interface ApiResponse {
  success: any | undefined
  error:
    | {
        code: number
        message: string
      }
    | undefined
}

export interface GameplayApiResponse extends ApiResponse {
  success: { [key: string]: string } | undefined
}

export interface GameInfoApiResponse extends ApiResponse {
  success: GameInfo[] | undefined
}

export interface GameInfo {
  code: string
  createdAt: number
  playerCount: number
  startedAt: number
  visibility: GameVisibility
  status: string
  subStatus: string
}

export let userIdToken: string | undefined

let apiURL: string

export async function init(apiUrl: string, token: string) {
  apiURL = apiUrl
  userIdToken = token
}

async function callApi(endpoint: string, body?: string) {
  return await fetch(new URL(endpoint, apiURL).toString(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${userIdToken}`,
    },
    body,
  })
}

export async function setStreamerMode(enabled: boolean) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ enabled }),
  }

  await fetch("/api/setStreamerMode", options)

  await invalidateAll()
}

async function setGameCodeCookie(code: string) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ code }),
  }

  await fetch("/api/joinGame", options)

  await invalidateAll()
}

export async function newGame(): Promise<boolean> {
  const endpoint: string = "newGame"
  const res: Response = await callApi(endpoint)
  if (!res.ok) {
    console.error(
      `Error ${res.status} while creating a new game at ${endpoint}\n\n${await res.text()}`,
    )
    return false
  }
  const jsonRes: CodeResponse = await res.json()
  await setGameCodeCookie(jsonRes.code)
  return true
}

export async function setGameVisibility(
  code: string,
  visibility: NonNullable<GameVisibility>,
): Promise<GameplayApiResponse> {
  const endpoint: string = "setGameVisibility"
  const res: Response = await callApi(
    endpoint,
    JSON.stringify({
      code,
      visibility,
    }),
  )

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

export async function joinGame(code: string): Promise<GameplayApiResponse> {
  const endpoint: string = "joinGame"
  const res: Response = await callApi(endpoint, JSON.stringify({ code }))

  if (!res.ok) {
    if (res.status === 453) {
      await setGameCodeCookie(code)
      return handleSuccess(res)
    } else {
      return handleError(res)
    }
  }

  const jsonRes: CodeResponse = await res.clone().json()
  // TODO: handle error if jsonRes.code !== code
  await setGameCodeCookie(jsonRes.code)
  return handleSuccess(res)
}

export async function unJoinGame(code: string): Promise<GameplayApiResponse> {
  const endpoint: string = "unJoinGame"
  const res: Response = await callApi(endpoint, JSON.stringify({ code }))

  if (!res.ok) {
    return handleError(res)
  }

  await setGameCodeCookie("")
  return handleSuccess(res)
}

export async function startGame(
  code: string,
  hidePicsGameInfo: boolean,
  skipLongIntro: boolean,
): Promise<GameplayApiResponse> {
  const endpoint: string = "startGame"
  const res: Response = await callApi(
    endpoint,
    JSON.stringify({
      code,
      hidePicsGameInfo,
      skipLongIntro,
    }),
  )

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

export async function chooseChancellor(
  code: string,
  chancellorId: string,
): Promise<GameplayApiResponse> {
  const endpoint: string = "chooseChancellor"
  const res: Response = await callApi(
    endpoint,
    JSON.stringify({
      code,
      chancellorId,
    }),
  )

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

export async function vote(code: string, vote: boolean): Promise<GameplayApiResponse> {
  const endpoint: string = "vote"
  const res: Response = await callApi(
    endpoint,
    JSON.stringify({
      code,
      vote,
    }),
  )

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

export async function presidentDiscardPolicy(
  code: string,
  policy: string,
): Promise<GameplayApiResponse> {
  const endpoint: string = "presidentDiscardPolicy"
  const res: Response = await callApi(
    endpoint,
    JSON.stringify({
      code,
      policy,
    }),
  )

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

export async function chancellorDiscardPolicy(
  code: string,
  policy: string,
): Promise<GameplayApiResponse> {
  const endpoint: string = "chancellorDiscardPolicy"
  const res: Response = await callApi(
    endpoint,
    JSON.stringify({
      code,
      policy,
    }),
  )

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

async function presidentialPower(
  code: string,
  extras?: { [key: string]: any },
): Promise<GameplayApiResponse> {
  const endpoint: string = "presidentialPower"
  const res: Response = await callApi(
    endpoint,
    JSON.stringify({
      code,
      ...extras,
    }),
  )

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

export async function presidentialPower_policyPeek(code: string): Promise<GameplayApiResponse> {
  return presidentialPower(code)
}

export async function presidentialPower_investigation(
  code: string,
  player?: string,
): Promise<GameplayApiResponse> {
  return presidentialPower(code, { player })
}

export async function presidentialPower_specialElection(
  code: string,
  player: string,
): Promise<GameplayApiResponse> {
  return presidentialPower(code, { player })
}

export async function presidentialPower_execution(
  code: string,
  player: string,
): Promise<GameplayApiResponse> {
  return presidentialPower(code, { player })
}

export async function askForVeto(code: string): Promise<GameplayApiResponse> {
  const endpoint: string = "askForVeto"
  const res: Response = await callApi(endpoint, JSON.stringify({ code }))

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

export async function answerVeto(code: string, refuseVeto: boolean): Promise<GameplayApiResponse> {
  const endpoint: string = "answerVeto"
  const res: Response = await callApi(endpoint, JSON.stringify({ code, refuseVeto }))

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

export async function leaveGame(): Promise<void> {
  await setGameCodeCookie("")

  await invalidateAll()
}

export async function getGamesForSelf(): Promise<GameInfoApiResponse> {
  const endpoint: string = "getGamesForSelf"
  const res: Response = await callApi(endpoint)

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

export async function getActivePublicGames(): Promise<GameInfoApiResponse> {
  const endpoint: string = "getActivePublicGames"
  const res: Response = await callApi(endpoint)

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

async function handleError(res: Response): Promise<ApiResponse> {
  const message: string = await res.text()

  console.error(`Error ${res.status}\n\n${message}`)

  return {
    success: undefined,
    error: {
      code: res.status,
      message,
    },
  }
}

async function handleSuccess(res: Response): Promise<ApiResponse> {
  return {
    success: await res.clone().json(),
    error: undefined,
  }
}
