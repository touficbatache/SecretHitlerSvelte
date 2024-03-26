import type { Database } from "firebase/database"
import { type DatabaseReference, onValue, ref as dbRef } from "firebase/database"
import { type Readable, readable } from "svelte/store"

import type { Player } from "$lib/player"
import { castGameData } from "$lib/firebase"

export interface GameData {
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
  readonly eligible: () => Player[]
  readonly visiblePlayerIds: () => string[]
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
}

export type GameType = "fiveSix" | "sevenEight" | "nineTen"

export type PresidentialPower = "consumed" | "done"

// https://sveltefire.fireship.io/
/**
 * @param {Database} rtdb - Firebase Realtime Database instance.
 * @param {string} gameCode - Code of the requested game.
 * @returns a store with realtime updates on individual database nodes.
 */
export function gameDataStore(rtdb: Database, gameCode: string): Readable<GameData | undefined> {
  const dataRef: DatabaseReference = dbRef(rtdb, `ongoingGames/${gameCode}`)

  return readable<GameData | undefined>(undefined, (set) => {
    return onValue(dataRef, (snapshot) => {
      set(castGameData(snapshot.val()) as GameData)
    })
  })
}
