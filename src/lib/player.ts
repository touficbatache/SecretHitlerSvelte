import type { GameType } from "$lib/game_data"

export interface Player {
  readonly id: string
  readonly assetReference: string
  readonly name: string
  readonly role: PlayerRole
  readonly membership: PlayerMembership
  readonly self: boolean
  readonly isExecuted: boolean
  readonly isPresident: boolean
  readonly isChancellor: boolean
  readonly isPreviousChancellor: boolean
  readonly vote: () => boolean
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
