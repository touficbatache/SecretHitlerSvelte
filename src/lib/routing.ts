/** Routes where the player is in a game: the waiting room, the intro and the gameplay. */
const GAME_ROUTE_IDS: string[] = ["/waitingRoom", "/intro", "/gameplay"]

export function isGameRoute(routeId: string | null | undefined): boolean {
  return routeId != null && GAME_ROUTE_IDS.includes(routeId)
}

/**
 * The game page matching the game's status, or undefined while the status isn't known yet
 * (still loading, or the game is being closed and the player is about to be sent home).
 */
export function routeForPhase(
  gameCode: string | undefined,
  status: string | undefined,
): string | undefined {
  if (gameCode === undefined) return "/"

  switch (status) {
    case undefined:
    case "deleted":
      return undefined
    case "waiting":
      return "/waitingRoom"
    case "settingUp":
      return "/intro"
    default:
      return "/gameplay"
  }
}
