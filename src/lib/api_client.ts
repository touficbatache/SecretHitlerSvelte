import { invalidateAll } from "$app/navigation"

export interface CodeResponse {
  code: string
}

interface ApiReponse {
  success: any
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
  const options = {
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
  const endpoint = "newGame"
  const res = await callApi(endpoint)
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

export async function joinGame(code: string): Promise<ApiReponse> {
  const endpoint = "joinGame"
  const res = await callApi(endpoint, JSON.stringify({ code }))

  if (!res.ok) {
    if (res.status === 453) {
      await setGameCodeCookie(code)
      return handleSuccess(res)
    } else {
      return handleError(res)
    }
  }

  const jsonRes: CodeResponse = await res.json()
  // TODO: handle error if jsonRes.code !== code
  await setGameCodeCookie(jsonRes.code)
  return handleSuccess(res)
}

export async function startGame(
  code: string,
  hidePicsGameInfo: boolean,
  skipLongIntro: boolean,
): Promise<ApiReponse> {
  const endpoint = "startGame"
  const res = await callApi(
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

export async function leaveGame(): Promise<void> {
  await setGameCodeCookie("")
}

async function handleError(res: Response): Promise<ApiReponse> {
  const message = await res.text()

  console.error(`Error ${res.status} while joining a game.\n\n${message}`)

  return {
    success: undefined,
    error: {
      code: res.status,
      message,
    },
  }
}

async function handleSuccess(res: Response): Promise<ApiReponse> {
  return {
    success: await res.json(),
    error: undefined,
  }
}
