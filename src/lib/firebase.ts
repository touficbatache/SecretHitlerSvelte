import { initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app"
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check"
import { getAuth, onIdTokenChanged, updateProfile, signOut as _signOut } from "firebase/auth"
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
  recaptchaSiteKey: string | undefined,
  devMode: boolean = false,
): void {
  if (!browser) {
    throw new Error("Can't use the Firebase client on the server.")
  }

  if (firebaseConfig === undefined) {
    console.error("Firebase options config is undefined.")
    return
  }

  if (recaptchaSiteKey === undefined) {
    console.error("ReCaptcha Enterprise site key is undefined.")
    return
  }

  if (!app) {
    app = initializeApp(firebaseConfig)
    if (devMode) {
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
    }
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    })
    rtdb = getDatabase(app)
    listenForAuthChanges()
  }
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

function listenForAuthChanges() {
  // Fire on:
  //    - sign in
  //    - token expiry (> 1 hour), generating a new one
  //    - sign out
  onIdTokenChanged(
    getAuth(app),
    async (user) => {
      if (user) {
        await setTokenCookie(await user.getIdToken())
      } else {
        await setTokenCookie(undefined)
      }
    },
    (err) => console.error(err.message),
  )
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
        location.reload()
      })
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

export function castGameData(snapshotValue: any): GameData {
  const user = getAuth(app).currentUser
  const {
    connected,
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
  const votes = Object.entries(currentSessionObj?.votes ?? {})
  const playersArray = Array.isArray(players) ? players : Object.values(players)
  const allPlayers: Player[] = playersArray.map((player) => ({
    id: player.id,
    assetReference: player.assetReference,
    name: player.name,
    role: player.role,
    membership: player.role === "liberal" ? "liberal" : "fascist",
    self: player.id === user?.uid,
    isConnected: connected[player.id] ?? false,
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
    players: {
      self: currentPlayer,
      all: allPlayers,
      others: otherPlayers,
      fascists: allPlayers.filter((player) => player.membership === "fascist"),
      liberals: allPlayers.filter((player) => player.membership === "liberal"),
      alive: () => allPlayers.filter((player) => !player.isExecuted),
      eligibleForChancellor: () =>
        allPlayers.filter(
          (player) => !player.isPresident && !player.isPreviousChancellor && !player.isExecuted,
        ),
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
