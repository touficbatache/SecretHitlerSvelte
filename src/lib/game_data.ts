import { type Database, type DatabaseReference, onValue, ref as dbRef } from "firebase/database"
import { derived, type Readable } from "svelte/store"

import * as ApiClient from "$lib/api_client"
import { castGameData } from "$lib/firebase"
import type { Player } from "$lib/player"

export interface GameData {
  readonly connected: {
    [playerId: string]: boolean
  }
  readonly currentSession: GameDataSession | undefined
  readonly electionTracker: number
  readonly gameType: GameType
  readonly isOwner: boolean
  readonly players: GameDataPlayers
  readonly policies: GameDataPolicies
  readonly presidentialPower: PresidentialPower | undefined
  readonly settings: {
    readonly hidePicsGameInfo: boolean
    readonly skipLongIntro: boolean
  }
  readonly specialElectionPlayer: string | undefined
  readonly startedAt: number | undefined
  readonly visibility: GameVisibility
  readonly status: string
  readonly subStatus: string
}

export interface GameDataPlayers {
  readonly self: Player
  readonly all: Player[]
  readonly others: Player[]
  readonly fascists: Player[]
  readonly liberals: Player[]
  readonly alive: () => Player[]
  readonly eligibleForChancellor: () => Player[]
  readonly visibleRolePlayerIds: () => string[]
}

export interface GameDataPolicies {
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
  readonly beingInvestigatedPlayerId: string | undefined
  readonly isVetoRefused: boolean | undefined
}

export type GameType = "fiveSix" | "sevenEight" | "nineTen"

export type PresidentialPower = "consumed" | "done"

export type GameVisibility = "public" | "private"

/**
 * Live data of the game whose code `gameCode` holds, or undefined when there is none.
 * Moving to another game drops the previous game's listener.
 *
 * @param getDatabase - the Realtime Database, read lazily since it only exists in the browser.
 * @param gameCode - the code of the current game.
 */
export function gameDataStore(
  getDatabase: () => Database,
  gameCode: Readable<string | undefined>,
): Readable<GameData | undefined> {
  return derived<Readable<string | undefined>, GameData | undefined>(
    gameCode,
    ($gameCode, set) => {
      set(undefined)
      if ($gameCode === undefined) return

      const dataRef: DatabaseReference = dbRef(getDatabase(), `ongoingGames/${$gameCode}`)
      return onValue(
        dataRef,
        (snapshot) => {
          const value: any = snapshot.val()
          if (value?.players === undefined) {
            // The game was closed or deleted
            ApiClient.leaveGame()
          } else {
            set(castGameData(value))
          }
        },
        (error) => console.error(`Can't read game ${$gameCode}:`, error),
      )
    },
    undefined,
  )
}
