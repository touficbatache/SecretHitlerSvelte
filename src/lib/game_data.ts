import type { Player } from "$lib/player"

export interface GameData {
  // currentSession:
  //   | {
  //       presidentId: string | undefined
  //       chancellorId: string | undefined
  //     }
  //   | undefined
  electionTracker: string
  isOwner: boolean
  players: GameDataPlayers
  policies: {
    board:
      | {
          liberal: number
          fascist: number
        }
      | undefined
    drawPileCount: number
    discardPileCount: number
  }
  settings: {
    hidePicsGameInfo: boolean
    skipLongIntro: boolean
  }
  startedAt: number | undefined
  status: string
  subStatus: string
}

export interface GameDataPlayers {
  all: Player[]
  others: Player[]
  self: Player
  eligible: Player[]
  fascists: Player[]
  liberals: Player[]
}
