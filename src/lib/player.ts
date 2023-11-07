export interface Player {
  assetReference: string
  name: string
  role: PlayerRole
  membership: PlayerMembership
  self: boolean
  isPresident: boolean
  isChancellor: boolean
  isPreviousChancellor: boolean
}

export type PlayerRole = "liberal" | "fascist" | "hitler"

export type PlayerMembership = "liberal" | "fascist"
