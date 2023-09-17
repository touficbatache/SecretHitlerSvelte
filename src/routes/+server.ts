import type { RequestHandler } from "@sveltejs/kit"

import { listenForGameChanges, stopListeningForGameChanges } from "$lib/server/firebase"

export const GET: RequestHandler = ({ locals }) => {
  const { user, gameCode } = locals

  const stream = new ReadableStream({
    start(controller) {
      if (gameCode !== undefined && user?.uid !== undefined) {
        listenForGameChanges(gameCode, user?.uid, (gameData) => {
          controller.enqueue(`data: ${JSON.stringify(gameData)}\n\n`)
        })
      }
      // else {
      //   controller.enqueue(`data: ${undefined}\n\n`)
      // }
    },
    cancel() {
      if (gameCode !== undefined) {
        stopListeningForGameChanges(gameCode)
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  })
}
