import { FIREBASE_SERVER_CONFIG } from "$env/static/private"
import { PUBLIC_FIREBASE_CONFIG } from "$env/static/public"

import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier"
import admin from "firebase-admin"

import type { GameData } from "$lib/game_data"

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

export async function verifyToken(token: string): Promise<DecodedIdToken> {
  if (token === undefined) {
    throw new Error("Invalid login.")
  }

  initializeFirebase()

  const decodedToken = await admin.auth().verifyIdToken(token)

  if (!decodedToken) {
    throw new Error("Couldn't decode login.")
  }

  return decodedToken
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
    players: playersArray.map((player) => ({
      assetReference: player.assetReference,
      name: player.name,
      role: player.role,
      membership: player.role === "liberal" ? "liberal" : "fascist",
      self: player.id === userId,
      isPresident: player.id === currentSessionObj?.presidentId,
      isChancellor: player.id === currentSessionObj?.chancellorId,
      isPreviousChancellor: player.id === lastSuccessfulChancellorId,
    })),
    policies: {
      board: policiesObj?.board,
      drawPileCount: policiesObj?.drawPile?.split(",").length ?? 0,
      discardPileCount: policiesObj?.discardPile?.split(",").length ?? 0,
    },
    settings,
    status,
    subStatus,
  }
}

export function listenForGameChanges(
  code: string,
  userId: string,
  callback: (gameData: GameData) => void,
) {
  if (code === undefined || !/^\d{6}$/.test(code)) {
    throw new Error("Invalid code.")
  }

  if (listeningCallback !== undefined) {
    return
  }

  initializeFirebase()

  listeningCallback = (snapshot: admin.database.DataSnapshot) => {
    if (snapshot?.val() !== null) {
      callback(castGameData(snapshot.val(), userId))
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
