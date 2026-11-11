import { initializeApp, type FirebaseApp } from "firebase/app"
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check"
import {
  connectAuthEmulator,
  getAuth,
  onIdTokenChanged,
  updateProfile,
  signOut as _signOut,
  type User as FirebaseUser,
} from "firebase/auth"
import { connectDatabaseEmulator, getDatabase, type Database } from "firebase/database"

import { browser } from "$app/environment"
import { invalidateAll } from "$app/navigation"
import type { AppConfig } from "$lib/config"
import type { GameData } from "$lib/game_data"
import { clearLocalSession } from "$lib/local_session"
import { canSeeRoles, type Player, type PlayerRole } from "$lib/player"
import type { User } from "$lib/user"

// The emulators listen on IPv4 only, and "localhost" may resolve to IPv6 first
const EMULATOR_HOST: string = "127.0.0.1"

// Initialize Firebase
export let app: FirebaseApp
export let rtdb: Database

/** Starts the Firebase client, once: later calls do nothing. */
export function initializeFirebase(config: AppConfig): void {
  if (!browser) {
    throw new Error("Can't use the Firebase client on the server.")
  }
  if (app) return

  app = initializeApp(config.firebaseAppConfig)
  if (config.debugMode) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
  }
  if (config.useEmulators) {
    // Local Firebase emulators, on their default ports. They don't check App Check tokens.
    connectAuthEmulator(getAuth(app), `http://${EMULATOR_HOST}:9099`, { disableWarnings: true })
  } else {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(config.recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    })
  }
  rtdb = getDatabase(app)
  if (config.useEmulators) {
    connectDatabaseEmulator(rtdb, EMULATOR_HOST, 9000)
  }
}

/**
 * The signed-in player, once Firebase has restored the login saved in this browser, or undefined
 * when nobody is signed in.
 */
export async function currentUser(): Promise<User | undefined> {
  const auth: ReturnType<typeof getAuth> = getAuth(app)
  await auth.authStateReady()
  const user: FirebaseUser | null = auth.currentUser
  if (user === null) return undefined
  return {
    uid: user.uid,
    name: user.displayName ?? undefined,
    phoneNumber: user.phoneNumber ?? "",
    token: await user.getIdToken(),
  }
}

/**
 * Reloads the app's data when the login changes: sign-in, sign-out, and the token renewed about
 * every hour. The reload reads the player and their token again (see +layout.ts).
 *
 * Call it once the app is running: Firebase reports the current login right away, which the
 * layout's load already read, so that first report is skipped. Returns the unsubscribe function.
 */
export function listenForAuthChanges(): () => void {
  let first: boolean = true
  return onIdTokenChanged(
    getAuth(app),
    async (user) => {
      if (first) {
        first = false
        return
      }
      if (user === null) {
        clearLocalSession()
      }
      await invalidateAll()
    },
    (err) => console.error(err.message),
  )
}

export function setUserName(name: string) {
  const user: FirebaseUser | null = getAuth(app).currentUser
  if (user !== null) {
    updateProfile(user, {
      displayName: name,
    })
      .then(() => location.reload())
      .catch((reason) => {
        console.error(reason)
      })
  } else {
    console.error("Current user cannot be found")
  }
}

export async function signOut() {
  // Success is handled by auth change listener
  _signOut(getAuth(app)).catch((reason) => {
    console.error(reason)
  })
}

/** Whether a player is signed in on this device (false until the session is restored). */
export function isSignedIn(): boolean {
  return app !== undefined && getAuth(app).currentUser !== null
}

/** A player as the database stores it, under the game's `players` node. */
interface DatabasePlayer {
  id: string
  name: string
  // Dealt when the game starts
  assetReference?: string
  role?: PlayerRole
  isExecuted?: boolean
  isInvestigated?: boolean
}

export function castGameData(snapshotValue: any): GameData {
  const user: FirebaseUser | null = getAuth(app).currentUser
  const {
    connected,
    currentSession,
    electionTracker,
    gameType,
    lastSuccessfulChancellorId,
    lastSuccessfulPresidentId,
    ownerId,
    pendingTransition,
    players,
    policies,
    presidentialPower,
    settings,
    specialElectionPlayer,
    startedAt,
    visibility,
    status,
    subStatus,
  } = snapshotValue
  const currentSessionObj:
    | {
        presidentId: string
        presidentPolicies: string
        chancellorId: string
        chancellorPolicies: string
        votes: {
          [playerId: string]: boolean
        }
      }
    | undefined = currentSession
  const votes: [string, boolean][] = Object.entries(currentSessionObj?.votes ?? {})
  const playersArray: DatabasePlayer[] = Array.isArray(players) ? players : Object.values(players)
  const allPlayers: Player[] = playersArray.map((player) => ({
    id: player.id,
    assetReference: player.assetReference,
    name: player.name,
    role: player.role,
    membership: player.role === "liberal" ? "liberal" : "fascist",
    self: player.id === user?.uid,
    isConnected: connected?.[player.id] ?? false,
    isExecuted: player.isExecuted ?? false,
    isInvestigated: player.isInvestigated ?? false,
    isPresident: player.id === currentSessionObj?.presidentId,
    isChancellor: player.id === currentSessionObj?.chancellorId,
    isPreviousChancellor: player.id === lastSuccessfulChancellorId,
    vote: () => votes.find(([playerId]) => player.id === playerId)?.[1],
  }))
  const currentPlayerIndex: number = allPlayers.findIndex((player) => player.self)
  const [currentPlayer, ...otherPlayers] = [
    ...allPlayers.slice(currentPlayerIndex),
    ...allPlayers.slice(0, currentPlayerIndex),
  ]
  const policiesObj:
    | {
        board?: {
          liberal: number
          fascist: number
        }
        drawPile: string
        discardPile?: {
          liberal: number
          fascist: number
        }
      }
    | undefined = policies
  return {
    connected,
    currentSession: {
      ...currentSession,
      president: () => allPlayers.find((player) => player.id === currentSessionObj?.presidentId),
      chancellor: () => allPlayers.find((player) => player.id === currentSessionObj?.chancellorId),
      presidentPolicies: currentSessionObj?.presidentPolicies?.split(","),
      chancellorPolicies: currentSessionObj?.chancellorPolicies?.split(","),
    },
    electionTracker,
    gameType,
    isOwner: ownerId === user?.uid,
    pendingTransition,
    players: {
      self: currentPlayer,
      all: allPlayers,
      others: otherPlayers,
      fascists: allPlayers.filter((player) => player.membership === "fascist"),
      liberals: allPlayers.filter((player) => player.membership === "liberal"),
      alive: () => allPlayers.filter((player) => !player.isExecuted),
      // Same rules as the server (eligibility.ts in SecretHitlerFirebase): the last elected
      // President and Chancellor are term-limited, except that with 5 or fewer players alive
      // only the last elected Chancellor is.
      eligibleForChancellor: () => {
        const alivePlayerCount: number = allPlayers.filter((player) => !player.isExecuted).length
        return allPlayers.filter(
          (player) =>
            !player.isPresident &&
            !player.isExecuted &&
            !player.isPreviousChancellor &&
            !(alivePlayerCount > 5 && player.id === lastSuccessfulPresidentId),
        )
      },
      visibleRolePlayerIds: () => canSeeRoles(currentPlayer, allPlayers, gameType),
    },
    policies: {
      ...policies,
      drawPile: policiesObj?.drawPile?.split(","),
      drawPileCount: () => policiesObj?.drawPile?.split(",").length ?? 0,
      discardPileCount: () =>
        (policiesObj?.discardPile?.liberal ?? 0) + (policiesObj?.discardPile?.fascist ?? 0),
    },
    presidentialPower,
    settings,
    startedAt,
    visibility: visibility === "public" ? "public" : "private",
    status,
    specialElectionPlayer,
    subStatus,
  }
}
