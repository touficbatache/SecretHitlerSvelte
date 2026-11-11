/**
 * Writes to the session cookie, one at a time.
 *
 * The `__session` cookie holds the login token, the current game and the streamer mode together:
 * Firebase Hosting only passes a cookie with that name on to the server. Each `/api/` route
 * rebuilds the whole cookie from the copy its request carried, so two writes in flight at once
 * lose one: the response that arrives last puts back the value the other changed. That happened
 * when a player rejoined a game right after a page load: the login refresh the page load sent
 * finished last, and put the player back in their previous game.
 */
let previous: Promise<unknown> = Promise.resolve()

/**
 * Sends `body` to the session route `path` (such as "/api/joinGame") once the previous session
 * write has had its response, so each write starts from the cookie the last one left.
 */
export function writeSession(
  path: string,
  body: unknown,
  send: typeof fetch = fetch,
): Promise<Response> {
  const write: () => Promise<Response> = () =>
    send(path, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify(body),
    })
  // A failed write doesn't hold back the next one
  const result: Promise<Response> = previous.then(write, write)
  previous = result.catch(() => undefined)
  return result
}
