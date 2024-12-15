import type { Cookies } from "@sveltejs/kit"

export interface SHSession {
  token?: string
  gameCode?: string
  streamerModeEnabled?: boolean
}

export function getSession(cookies: Cookies): SHSession {
  try {
    return JSON.parse(cookies.get("__session") ?? "{}")
  } catch (e) {
    return {}
  }
}

export function setSession(cookies: Cookies, session: SHSession) {
  cookies.set("__session", JSON.stringify(session), {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  })
}

export function deleteSession(cookies: Cookies) {
  cookies.delete("__session", { path: "/" })
}
