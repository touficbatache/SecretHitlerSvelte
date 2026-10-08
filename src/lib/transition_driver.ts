/**
 * Moves the game on when a pause between phases is over: every player's app calls /advance at
 * the pause's end, on the server's clock. The server applies the transition once, whoever asks
 * first, and the new phase reaches everyone through the database.
 */
export interface TransitionDriver {
  /** The game and the end of its current pause (server time), or undefined when there's none. */
  follow: (gameCode: string | undefined, pauseEndsAt: number | undefined) => void
  stop: () => void
}

const RETRY_MS: number = 1000

export function createTransitionDriver(
  advance: (gameCode: string) => Promise<number | undefined>,
  serverNow: () => number,
): TransitionDriver {
  let target: { gameCode: string; at: number } | undefined
  let timer: ReturnType<typeof setTimeout> | undefined

  function schedule(gameCode: string, at: number, delayMs: number) {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      if (target?.gameCode !== gameCode || target.at !== at) return
      try {
        const stillPendingUntil: number | undefined = await advance(gameCode)
        // Still on: this device's clock was early. Ask again when the server says.
        if (stillPendingUntil !== undefined && target?.gameCode === gameCode && target.at === at) {
          schedule(gameCode, at, Math.max(stillPendingUntil - serverNow(), 0) + 50)
        }
      } catch (error) {
        console.error(error)
        if (target?.gameCode === gameCode && target.at === at) {
          schedule(gameCode, at, RETRY_MS)
        }
      }
    }, delayMs)
  }

  return {
    follow(gameCode: string | undefined, pauseEndsAt: number | undefined) {
      if (target?.gameCode === gameCode && target?.at === pauseEndsAt) return

      clearTimeout(timer)
      target =
        gameCode !== undefined && pauseEndsAt !== undefined
          ? { gameCode, at: pauseEndsAt }
          : undefined
      if (target !== undefined) {
        schedule(target.gameCode, target.at, Math.max(target.at - serverNow(), 0))
      }
    },
    stop() {
      clearTimeout(timer)
      target = undefined
    },
  }
}
