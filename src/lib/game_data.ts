import type { Player } from "$lib/player"

export interface GameData {
  readonly currentSession: GameDataSession | undefined
  readonly electionTracker: string
  readonly gameType: GameType
  readonly isOwner: boolean
  readonly players: GameDataPlayers
  readonly policies: {
    readonly board:
      | {
          readonly liberal: number
          readonly fascist: number
        }
      | undefined
    readonly drawPile: string[]
    readonly drawPileCount: () => number
    readonly discardPile:
      | {
          readonly liberal: number
          readonly fascist: number
        }
      | undefined
    readonly discardPileCount: () => number
  }
  readonly settings: {
    readonly hidePicsGameInfo: boolean
    readonly skipLongIntro: boolean
  }
  readonly startedAt: number | undefined
  readonly status: string
  readonly subStatus: string
}

export interface GameDataPlayers {
  readonly self: Player
  readonly all: Player[]
  readonly others: Player[]
  readonly fascists: Player[]
  readonly liberals: Player[]
  readonly eligible: () => Player[]
  readonly visiblePlayerIds: () => string[]
}

export interface GameDataSession {
  readonly president: () => Player
  readonly presidentId: string
  readonly presidentPolicies: string[] | undefined
  readonly chancellor: () => Player | undefined
  readonly chancellorId: string | undefined
  readonly chancellorPolicies: string[] | undefined
  readonly votes: {
    readonly [playerId: string]: boolean
  }
}

export type GameType = "fiveSix" | "sevenEight" | "nineTen"
