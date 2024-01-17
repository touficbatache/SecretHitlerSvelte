import { invalidateAll } from "$app/navigation"

export interface CodeResponse {
  code: string
}

export interface ApiResponse {
  success: { [key: string]: string } | undefined
  error:
    | {
        code: number
        message: string
      }
    | undefined
}

export let userIdToken: string | undefined

export function init(token: string) {
  userIdToken = token
}

// https://us-central1-secret-hitler-app.cloudfunctions.net/api/${endpoint}
async function callApi(endpoint: string, body?: string) {
  return await fetch(
    `https://us-central1-secret-hitler-test-app.cloudfunctions.net/api/${endpoint}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${userIdToken}`,
      },
      body,
    },
  )
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

export async function joinGame(code: string): Promise<ApiResponse> {
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

export async function startGame(
  code: string,
  hidePicsGameInfo: boolean,
  skipLongIntro: boolean,
): Promise<ApiResponse> {
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

export async function chooseChancellor(code: string, chancellorId: string): Promise<ApiResponse> {
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

export async function vote(code: string, vote: boolean): Promise<ApiResponse> {
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

export async function presidentDiscardPolicy(code: string, policy: string): Promise<ApiResponse> {
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

export async function chancellorDiscardPolicy(code: string, policy: string): Promise<ApiResponse> {
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
): Promise<ApiResponse> {
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

export async function presidentialPower_policyPeek(code: string): Promise<ApiResponse> {
  return presidentialPower(code)
}

export async function presidentialPower_investigation(
  code: string,
  player?: string,
): Promise<ApiResponse> {
  return presidentialPower(code, { player })
}

export async function presidentialPower_specialElection(
  code: string,
  player: string,
): Promise<ApiResponse> {
  return presidentialPower(code, { player })
}

export async function presidentialPower_execution(
  code: string,
  player: string,
): Promise<ApiResponse> {
  return presidentialPower(code, { player })
}

export async function askForVeto(code: string): Promise<ApiResponse> {
  const endpoint: string = "askForVeto"
  const res: Response = await callApi(endpoint, JSON.stringify({ code }))

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

export async function answerVeto(code: string, refuseVeto: boolean): Promise<ApiResponse> {
  const endpoint: string = "answerVeto"
  const res: Response = await callApi(endpoint, JSON.stringify({ code, refuseVeto }))

  if (!res.ok) {
    return handleError(res)
  }

  return handleSuccess(res)
}

export async function leaveGame(): Promise<void> {
  await setGameCodeCookie("")
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
