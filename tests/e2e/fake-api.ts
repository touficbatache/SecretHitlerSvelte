import http, { type IncomingMessage, type Server, type ServerResponse } from "node:http"

/**
 * Stands in for the game API (SecretHitlerFirebase) during the end-to-end tests: the tests write
 * game states straight into the database emulator, so the API only has to answer.
 *
 * Control endpoints, for the tests:
 *   GET  /__calls  the endpoints called since the last reset
 *   POST /__reset  forget the calls, the failures and the games
 *   POST /__fail   body {"endpoint": "...", "status": 500}: make an endpoint fail
 *   POST /__games  body [...]: the games getGamesForSelf returns
 */

interface Call {
  endpoint: string
  body: Record<string, unknown>
  /** The user id in the request's ID token. */
  uid: string | undefined
  /** When the call arrived. */
  receivedAt: number
}

function uidOf(req: IncomingMessage): string | undefined {
  try {
    const token: string = (req.headers.authorization ?? "").replace("Bearer ", "")
    return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString()).user_id
  } catch {
    return undefined
  }
}

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
}

function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body: string = ""
    req.on("data", (chunk: Buffer) => (body += chunk))
    req.on("end", () => resolve(body ? JSON.parse(body) : {}))
  })
}

function send(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json", ...CORS })
  res.end(JSON.stringify(body))
}

/** Starts the fake API. Resolves to a function that stops it. */
export function startFakeApi(port: number): Promise<() => Promise<void>> {
  let calls: Call[] = []
  let failures: Record<string, number> = {}
  let games: unknown[] = []

  const server: Server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const endpoint: string = new URL(req.url ?? "/", "http://localhost").pathname.replace(
      /^\/|\/$/g,
      "",
    )
    if (req.method === "OPTIONS") return send(res, 204, {})

    switch (endpoint) {
      case "__calls":
        return send(res, 200, calls)
      case "__reset":
        calls = []
        failures = {}
        games = []
        return send(res, 200, {})
      case "__fail": {
        const { endpoint: failing, status } = await readBody(req)
        failures[failing] = status
        return send(res, 200, {})
      }
      case "__games":
        games = await readBody(req)
        return send(res, 200, {})
    }

    const receivedAt: number = Date.now()
    const body: Record<string, unknown> = await readBody(req)
    calls.push({ endpoint, body, uid: uidOf(req), receivedAt })

    const failure: number | undefined = failures[endpoint]
    if (failure !== undefined) {
      return send(res, failure, { message: `${failure} - Failure requested by the test` })
    }

    switch (endpoint) {
      case "getGamesForSelf":
        return send(res, 200, games)
      case "getActivePublicGames":
        return send(res, 200, { joinableGames: [], watchableGames: [] })
      case "presidentialPower":
        return send(res, 200, { code: body.code, policies: "liberal,fascist,liberal" })
      default:
        return send(res, 200, { code: body.code })
    }
  })

  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () =>
      resolve(() => new Promise((done) => server.close(() => done()))),
    )
  })
}
