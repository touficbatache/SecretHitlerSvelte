import { initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app"
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check"
import {
  signOut as _signOut,
  getAuth,
  onIdTokenChanged,
  updateProfile,
  type Auth,
} from "firebase/auth"
import { getDatabase, type Database } from "firebase/database"

import { browser } from "$app/environment"
import { invalidateAll } from "$app/navigation"
import type { GameData } from "$lib/game_data"
import { canSeeRoles, type Player } from "$lib/player"

// Initialize Firebase
export let app: FirebaseApp
export let rtdb: Database

export function initializeFirebase(
  firebaseConfig: FirebaseOptions | undefined,
  devMode: boolean = false,
): void {
  if (!browser) {
    throw new Error("Can't use the Firebase client on the server.")
  }

  if (firebaseConfig === undefined) {
    console.error("Firebase options config is undefined.")
    return
  }

  if (!app) {
    app = initializeApp(firebaseConfig)
    rtdb = getDatabase(app)
    if (devMode) {
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
    }
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider("6LfGHDUoAAAAAFX-EBTpFEbo-v7n08QGyQPPk5yo"),
      isTokenAutoRefreshEnabled: true,
    })
    listenForAuthChanges()
  }
}

function listenForAuthChanges() {
  const auth: Auth = getAuth(app)

  // In addition to sign-in and sign-out, this observer will
  // fire if a token has expired (> 1 hour), generating a new one
  onIdTokenChanged(
    auth,
    async (user) => {
      if (user) {
        const token: string = await user.getIdToken()
        await setTokenCookie(token)
      } else {
        await setTokenCookie(undefined)
      }
    },
    (err) => console.error(err.message),
  )
}

async function setTokenCookie(token: string | undefined) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ token }),
  }

  await fetch("/api/login", options)

  await invalidateAll()
}

export function setUserName(name: string) {
  const currentUser = getAuth(app).currentUser
  if (currentUser !== null) {
    updateProfile(currentUser, {
      displayName: name,
    })
      .then(async () => {
        const token = await getAuth(app).currentUser?.getIdToken()
        await setTokenCookie(token)
      })
      .catch((reason) => {
        console.error(reason)
      })
  } else {
    console.error("Current user cannot be found")
  }
}

export async function signOut() {
  const auth: Auth = getAuth(app)
  await _signOut(auth)
}

export function castGameData(snapshotValue: any): GameData {
  const user = getAuth(app).currentUser
  const {
    currentSession,
    electionTracker,
    gameType,
    lastSuccessfulChancellorId,
    ownerId,
    players,
    policies,
    presidentialPower,
    settings,
    specialElectionPlayer,
    startedAt,
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
  const votes = Object.entries(currentSessionObj?.votes ?? {})
  const playersArray = Array.isArray(players) ? players : Object.values(players)
  const allPlayers: Player[] = playersArray.map((player) => ({
    id: player.id,
    assetReference: player.assetReference,
    name: player.name,
    role: player.role,
    membership: player.role === "liberal" ? "liberal" : "fascist",
    self: player.id === user?.uid,
    isExecuted: player.isExecuted ?? false,
    isInvestigated: player.isInvestigated ?? false,
    isPresident: player.id === currentSessionObj?.presidentId,
    isChancellor: player.id === currentSessionObj?.chancellorId,
    isPreviousChancellor: player.id === lastSuccessfulChancellorId,
    vote: () => votes.find(([playerId]) => player.id === playerId)?.[1],
  }))
  const currentPlayerIndex = allPlayers.findIndex((player) => player.self)
  const [currentPlayer, ...otherPlayers] = [
    ...allPlayers.slice(currentPlayerIndex),
    ...allPlayers.slice(0, currentPlayerIndex),
  ]
  const policiesObj:
    | {
        board:
          | {
              liberal: number
              fascist: number
            }
          | undefined
        drawPile: string[]
        discardPile:
          | {
              liberal: number
              fascist: number
            }
          | undefined
      }
    | undefined = policies
  return {
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
    players: {
      self: currentPlayer,
      all: allPlayers,
      others: otherPlayers,
      fascists: allPlayers.filter((player) => player.membership === "fascist"),
      liberals: allPlayers.filter((player) => player.membership === "liberal"),
      alive: () => allPlayers.filter((player) => !player.isExecuted),
      eligible: () =>
        otherPlayers.filter((player) => !player.isPreviousChancellor && !player.isExecuted),
      visiblePlayerIds: () => canSeeRoles(currentPlayer, allPlayers, gameType),
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
    status,
    specialElectionPlayer,
    subStatus,
  }
}
