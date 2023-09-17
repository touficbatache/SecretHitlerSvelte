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
  players: Player[]
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
  status: string
  subStatus: string
}
