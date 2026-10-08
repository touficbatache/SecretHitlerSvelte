import type { GameData } from "$lib/game_data"
import type { Player } from "$lib/player"

/** What a player has to do when the game is waiting on them, keyed by sub-status. */
const TURN_ACTIONS: { [subStatus: string]: string } = {
  election_presidentChoosingChancellor: "choose your Chancellor",
  election_voting: "cast your vote",
  legislativeSession_presidentDiscardingPolicy: "discard a policy",
  legislativeSession_chancellorDiscardingPolicy: "enact a policy",
  legislativeSession_chancellorSeekingVeto: "answer the veto request",
  presidentialPower_policyPeek: "peek at the next 3 policies",
  presidentialPower_investigateLoyalty: "investigate a player",
  presidentialPower_callSpecialElection: "choose the next President",
  presidentialPower_execution: "execute a player",
}

/** The players the game can't move on without, in the current phase. */
export function playersToWaitFor(gameData: GameData | undefined): Player[] {
  if (gameData === undefined) return []

  const president: Player | undefined = gameData.currentSession?.president()
  const chancellor: Player | undefined = gameData.currentSession?.chancellor()

  switch (gameData.subStatus) {
    case "election_voting":
      return gameData.players.alive().filter((player) => player.vote() === undefined)
    case "legislativeSession_chancellorDiscardingPolicy":
      return chancellor !== undefined ? [chancellor] : []
    case "election_presidentChoosingChancellor":
    case "legislativeSession_presidentDiscardingPolicy":
    case "legislativeSession_chancellorSeekingVeto":
    case "presidentialPower_policyPeek":
    case "presidentialPower_investigateLoyalty":
    case "presidentialPower_callSpecialElection":
    case "presidentialPower_execution":
      return president !== undefined ? [president] : []
    default:
      return []
  }
}

/** "Your turn: …" when the game is waiting on this player, undefined otherwise. */
export function ownTurnText(gameData: GameData | undefined): string | undefined {
  const action: string | undefined = TURN_ACTIONS[gameData?.subStatus ?? ""]
  if (action === undefined || !playersToWaitFor(gameData).some((player) => player.self)) {
    return undefined
  }
  return `Your turn: ${action}`
}
