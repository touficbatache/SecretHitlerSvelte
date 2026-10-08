import { browser } from "$app/environment"
import { invalidateAll } from "$app/navigation"
import {
  type ActionResult,
  type ApiError,
  type GameAction,
  readApiError,
  sendGameAction,
} from "$lib/game_action"
import type { GameVisibility } from "$lib/game_data"

export interface CodeResponse {
  code: string
}

export interface ApiResponse {
  success: any | undefined
  error: ApiError | undefined
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

/** Which API to call, and as which user. */
export interface ApiAuth {
  apiURL: string
  token: string | undefined
}

/**
 * Browser only. A browser tab has a single user, so keeping their credentials in module
 * state is safe there. On the server one module instance serves every request, so server
 * code must pass an ApiAuth explicitly instead (see getGamesForSelf, getActivePublicGames).
 */
let browserAuth: ApiAuth | undefined

export function init(apiUrl: string, token: string) {
  if (!browser) {
    throw new Error("ApiClient.init() is browser-only. On the server, pass an ApiAuth explicitly.")
  }
  browserAuth = { apiURL: apiUrl, token }
}

async function callApi(endpoint: string, body?: string, auth: ApiAuth | undefined = browserAuth) {
  if (auth === undefined) {
    throw new Error(`API call to ${endpoint} without credentials: call init() or pass an ApiAuth.`)
  }

  return await fetch(new URL(endpoint, auth.apiURL).toString(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${auth.token}`,
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
    const error: ApiError = await readApiError(res.clone())
    if (error.code === "ALREADY_IN_GAME") {
      await setGameCodeCookie(code)
      return { success: { code }, error: undefined }
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

/** Plays a move in the game (see game_action.ts). Retries are safe: a move is never played twice. */
export function sendAction(code: string, action: GameAction): Promise<ActionResult> {
  return sendGameAction((body: string) => callApi("action", body), code, action)
}

/**
 * Asks the server to move the game on once a pause between phases is over (see
 * GameData.pendingTransition).
 *
 * @returns when the pause ends, if it's still on (this device's clock was early), or undefined.
 * @throws if the request failed in a way worth retrying.
 */
export async function advance(code: string): Promise<number | undefined> {
  const res: Response = await callApi("advance", JSON.stringify({ code }))

  if (res.ok) {
    return ((await res.json()) as { pendingTransitionAt?: number }).pendingTransitionAt
  }
  if (res.status >= 500 || res.status === 409) {
    throw new Error(`advance failed with ${res.status}`)
  }
  // The game is gone, or this player isn't in it: nothing to retry
  return undefined
}

export async function leaveGame(): Promise<void> {
  await setGameCodeCookie("")

  await invalidateAll()
}

export async function getGamesForSelf(auth?: ApiAuth): Promise<GameInfoApiResponse> {
  const endpoint: string = "getGamesForSelf"
  const res: Response = await callApi(endpoint, undefined, auth)

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

export async function getActivePublicGames(auth?: ApiAuth): Promise<GameInfoApiResponse> {
  const endpoint: string = "getActivePublicGames"
  const res: Response = await callApi(endpoint, undefined, auth)

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

async function handleError(res: Response): Promise<ApiResponse> {
  const error: ApiError = await readApiError(res)

  console.error(`Error ${error.status} ${error.code}: ${error.message}`)

  return { success: undefined, error }
}

async function handleSuccess(res: Response): Promise<ApiResponse> {
  return {
    success: await res.clone().json(),
    error: undefined,
  }
}
