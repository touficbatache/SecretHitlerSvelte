import { expect, test } from "@playwright/test"

import type { GameData } from "$lib/game_data"
import type { Player } from "$lib/player"
import { ownTurnText, playersToWaitFor } from "$lib/turn"

function player(id: string, extra: Partial<Player> = {}): Player {
  return {
    id,
    name: id,
    self: false,
    isConnected: true,
    isExecuted: false,
    vote: () => undefined,
    ...extra,
  } as Player
}

function game(
  subStatus: string | undefined,
  players: Player[],
  { presidentId = "p", chancellorId = "c" }: { presidentId?: string; chancellorId?: string } = {},
): GameData {
  return {
    subStatus,
    players: {
      all: players,
      self: players.find((p) => p.self),
      alive: () => players.filter((p) => !p.isExecuted),
    },
    currentSession: {
      president: () => players.find((p) => p.id === presidentId),
      chancellor: () => players.find((p) => p.id === chancellorId),
    },
  } as unknown as GameData
}

const ids: (players: Player[]) => string[] = (players) => players.map((p) => p.id)

test.describe("playersToWaitFor", () => {
  test("waits for the President while they choose a Chancellor", () => {
    const players: Player[] = [player("p"), player("c"), player("x")]
    expect(ids(playersToWaitFor(game("election_presidentChoosingChancellor", players)))).toEqual([
      "p",
    ])
  })

  test("waits for the Chancellor while they discard", () => {
    const players: Player[] = [player("p"), player("c"), player("x")]
    expect(
      ids(playersToWaitFor(game("legislativeSession_chancellorDiscardingPolicy", players))),
    ).toEqual(["c"])
  })

  test("waits for living players who haven't voted, not for the dead", () => {
    const players: Player[] = [
      player("p", { vote: () => true }),
      player("c", { vote: () => false }),
      player("x"),
      player("dead", { isExecuted: true }),
    ]
    expect(ids(playersToWaitFor(game("election_voting", players)))).toEqual(["x"])
  })

  test("waits for nobody during the vote reveal, after the game, or without data", () => {
    const players: Player[] = [player("p"), player("c")]
    for (const subStatus of ["election_votingEnded", "gameEnded_liberal", undefined]) {
      expect(playersToWaitFor(game(subStatus, players))).toEqual([])
    }
    expect(playersToWaitFor(undefined)).toEqual([])
  })

  for (const subStatus of [
    "legislativeSession_presidentDiscardingPolicy",
    "legislativeSession_chancellorSeekingVeto",
    "presidentialPower_policyPeek",
    "presidentialPower_investigateLoyalty",
    "presidentialPower_callSpecialElection",
    "presidentialPower_execution",
  ]) {
    test(`waits for the President during ${subStatus}`, () => {
      expect(ids(playersToWaitFor(game(subStatus, [player("p"), player("c")])))).toEqual(["p"])
    })
  }
})

test.describe("ownTurnText", () => {
  test("tells the President to choose a Chancellor", () => {
    const players: Player[] = [player("p", { self: true }), player("c")]
    expect(ownTurnText(game("election_presidentChoosingChancellor", players))).toBe(
      "Your turn: choose your Chancellor",
    )
  })

  test("is undefined when the game waits on someone else", () => {
    const players: Player[] = [player("p", { self: true }), player("c")]
    expect(ownTurnText(game("legislativeSession_chancellorDiscardingPolicy", players))).toBe(
      undefined,
    )
    expect(ownTurnText(game("gameEnded_liberal", players))).toBe(undefined)
  })

  test("asks for a vote only until the player has voted", () => {
    expect(ownTurnText(game("election_voting", [player("p"), player("c", { self: true })]))).toBe(
      "Your turn: cast your vote",
    )
    const voted: Player[] = [player("p", { self: true, vote: () => true }), player("c")]
    expect(ownTurnText(game("election_voting", voted))).toBe(undefined)
  })
})
