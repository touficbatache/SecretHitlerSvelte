import { FIREBASE_SERVER_CONFIG } from "$env/static/private"
import { PUBLIC_FIREBASE_CONFIG } from "$env/static/public"

import admin from "firebase-admin"
import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier"

import type { Error } from "$lib/error"
import type { GameData } from "$lib/game_data"
import type { Player } from "$lib/player"

export interface FirebaseServerConfig {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: number
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
  universe_domain: string
}

export interface TokenResponse extends DecodedIdToken {
  name: string | undefined
}

let listeningCallback: ((snapshot: admin.database.DataSnapshot) => void) | undefined

function initializeFirebase() {
  if (!admin.apps.length) {
    const publicConfig = JSON.parse(PUBLIC_FIREBASE_CONFIG)
    const serviceAccount = JSON.parse(FIREBASE_SERVER_CONFIG)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: publicConfig.databaseURL,
    })
  }
}

export async function verifyToken(token: string): Promise<TokenResponse> {
  if (token === undefined) {
    throw new Error("Invalid login.")
  }

  initializeFirebase()

  const decodedToken = await admin.auth().verifyIdToken(token)

  if (!decodedToken) {
    throw new Error("Couldn't decode login.")
  }

  const user = await admin.auth().getUser(decodedToken.uid)

  return {
    ...decodedToken,
    name: user.displayName,
  }
}

function castGameData(snapshotValue: any, userId: string): GameData {
  const {
    currentSession,
    electionTracker,
    lastSuccessfulChancellorId,
    ownerId,
    players,
    policies,
    settings,
    startedAt,
    status,
    subStatus,
  } = snapshotValue
  const currentSessionObj = currentSession as
    | {
        presidentId: string
        chancellorId: string
      }
    | undefined
  const playersArray = Array.isArray(players) ? players : Object.values(players)
  const allPlayers: Player[] = playersArray.map((player) => ({
    assetReference: player.assetReference,
    name: player.name,
    role: player.role,
    membership: player.role === "liberal" ? "liberal" : "fascist",
    self: player.id === userId,
    isPresident: player.id === currentSessionObj?.presidentId,
    isChancellor: player.id === currentSessionObj?.chancellorId,
    isPreviousChancellor: player.id === lastSuccessfulChancellorId,
  }))
  const currentPlayerIndex = allPlayers.findIndex((player) => player.self)
  const [currentPlayer, ...otherPlayers] = [
    ...allPlayers.slice(currentPlayerIndex),
    ...allPlayers.slice(0, currentPlayerIndex),
  ]
  const policiesObj = policies as
    | {
        board: { fascist: number; liberal: number }
        drawPile: string | undefined
        discardPile: string | undefined
      }
    | undefined
  return {
    // currentSession: {
    //   presidentId: currentSessionObj?.presidentId,
    //   chancellorId: currentSessionObj?.chancellorId,
    //   lastChancellorId:
    // },
    electionTracker,
    isOwner: ownerId === userId,
    players: {
      all: allPlayers,
      others: otherPlayers,
      self: currentPlayer,
      fascists: allPlayers.filter((player) => player.membership === "fascist"),
      liberals: allPlayers.filter((player) => player.membership === "liberal"),
    },
    policies: {
      board: policiesObj?.board,
      drawPileCount: policiesObj?.drawPile?.split(",").length ?? 0,
      discardPileCount: policiesObj?.discardPile?.split(",").length ?? 0,
    },
    settings,
    startedAt,
    status,
    subStatus,
  }
}

export function listenForGameChanges(
  code: string,
  userId: string,
  callback: (gameData: GameData | undefined, error: Error | undefined) => void,
) {
  if (code === undefined || !/^\d{6}$/.test(code)) {
    throw new Error("Invalid code.")
  }

  if (listeningCallback !== undefined) {
    return
  }

  initializeFirebase()

  listeningCallback = (snapshot: admin.database.DataSnapshot) => {
    if (!snapshot.exists()) {
      callback(undefined, { message: "Game doesn't exist" } as Error)
    } else if (snapshot?.val() !== null) {
      callback(castGameData(snapshot.val(), userId), undefined)
    }
  }

  admin
    .database()
    .ref(`/ongoingGames/${code}`)
    .on("value", listeningCallback, (errorObject) => {
      console.error(
        `Error ${errorObject.name} while listening for game changes with code ${code}\n\n${errorObject.message}`,
      )
    })
}

export function stopListeningForGameChanges(code: string) {
  if (listeningCallback === undefined) {
    return
  }

  admin.database().ref(`/ongoingGames/${code}`).off("value", listeningCallback)
  listeningCallback = undefined
}
