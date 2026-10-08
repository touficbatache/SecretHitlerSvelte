import type { GameType } from "$lib/game_data"

export interface Player {
  readonly id: string
  readonly assetReference: string | undefined
  readonly name: string
  readonly role: PlayerRole | undefined
  readonly membership: PlayerMembership
  readonly self: boolean
  readonly isConnected: boolean
  readonly isExecuted: boolean
  readonly isInvestigated: boolean
  readonly isPresident: boolean
  isPreviousPresident?: boolean
  readonly isChancellor: boolean
  readonly isPreviousChancellor: boolean
  /** The player's vote in the current election, undefined while they haven't voted. */
  readonly vote: () => boolean | undefined
}

export type PlayerRole = "liberal" | "fascist" | "hitler"

export type PlayerMembership = "liberal" | "fascist"

export function canSeeRole(
  self: Player | undefined,
  player: Player | undefined,
  gameType: GameType | undefined,
): boolean {
  if (self === undefined || player === undefined || gameType === undefined) {
    return false
  }

  return (
    self.id === player.id ||
    (gameType === "fiveSix" && self.role !== "liberal") ||
    self.role === "fascist"
  )
}

export function canSeeRoles(
  self: Player | undefined,
  players: Player[] | undefined,
  gameType: GameType | undefined,
): string[] {
  if (self === undefined || players === undefined || gameType === undefined) {
    return []
  }

  return players
    .map((player) => (canSeeRole(self, player, gameType) ? player.id : undefined))
    .filter((playerId): playerId is string => !!playerId)
}
