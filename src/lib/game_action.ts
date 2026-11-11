import { v4 as uuidV4 } from "uuid"

/** A game move, as the API's POST /action takes it. The server knows which player sends it. */
export type GameAction =
  | { type: "nominate"; chancellorId: string }
  | { type: "vote"; ja: boolean }
  | { type: "discard"; policy: string }
  | { type: "proposeVeto" }
  | { type: "answerVeto"; accept: boolean }
  /** Uses the current presidential power. Every power but the policy peek needs a target. */
  | { type: "usePower"; targetId?: string }
  /** Closes the policy peek or the investigation result. */
  | { type: "endPower" }

/**
 * Why the API refused a request (see the API's README), or NETWORK when no response came back.
 * Other codes may be added, so an unknown one is a plain string.
 */
export type ApiErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_REQUEST"
  | "GAME_NOT_FOUND"
  | "NOT_IN_GAME"
  | "NOT_OWNER"
  | "NOT_YOUR_TURN"
  | "WRONG_PHASE"
  | "PAUSED"
  | "GAME_BUSY"
  | "INELIGIBLE"
  | "INVALID_ACTION"
  | "ALREADY_IN_GAME"
  | "GAME_FULL"
  | "GAME_STARTED"
  | "NOT_ENOUGH_PLAYERS"
  | "INTERNAL"
  | "NETWORK"

export interface ApiError {
  code: ApiErrorCode | string
  /** The HTTP status, or 0 for a network error. */
  status: number
  message: string
}

export type ActionResult =
  | {
      ok: true
      /** The response: `policies` for a policy peek, `membership` for an investigation. */
      data: { [key: string]: string }
    }
  | { ok: false; error: ApiError }

/** Reads an error response: `{ error: { code, message } }`. */
export async function readApiError(res: Response): Promise<ApiError> {
  const text: string = await res.text()
  try {
    const { code, message } = JSON.parse(text).error
    if (typeof code === "string") {
      return { code, status: res.status, message: typeof message === "string" ? message : code }
    }
  } catch {
    // Not one of the API's errors, like a proxy's error page
  }
  return {
    code: res.status >= 500 ? "INTERNAL" : "INVALID_REQUEST",
    status: res.status,
    message: text,
  }
}

/** Errors worth sending the same action again for: it may not have reached the game. */
const RETRYABLE: ReadonlySet<string> = new Set(["NETWORK", "GAME_BUSY"])

export interface SendOptions {
  /** How long to wait before each retry. One retry per entry. */
  retryDelays?: number[]
  newActionId?: () => string
  wait?: (ms: number) => Promise<void>
}

/**
 * Sends a move with a new actionId, and sends it again with the same id if it may not have
 * reached the game: the API then answers a retry of a move that succeeded with its first
 * response, so a move is never played twice.
 *
 * @param post sends a request body to POST /action
 */
export async function sendGameAction(
  post: (body: string) => Promise<Response>,
  code: string,
  action: GameAction,
  {
    retryDelays = [500, 1500],
    newActionId = uuidV4,
    wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
  }: SendOptions = {},
): Promise<ActionResult> {
  const body: string = JSON.stringify({ code, actionId: newActionId(), action })

  let result: ActionResult = await attempt(post, body)
  for (const delay of retryDelays) {
    if (result.ok || !RETRYABLE.has(result.error.code)) break
    await wait(delay)
    result = await attempt(post, body)
  }
  if (!result.ok) {
    console.error(`${action.type} failed: ${result.error.code} (${result.error.message})`)
  }
  return result
}

async function attempt(
  post: (body: string) => Promise<Response>,
  body: string,
): Promise<ActionResult> {
  let res: Response
  try {
    res = await post(body)
  } catch (err) {
    return { ok: false, error: { code: "NETWORK", status: 0, message: String(err) } }
  }
  if (!res.ok) return { ok: false, error: await readApiError(res) }
  return { ok: true, data: await res.json() }
}
