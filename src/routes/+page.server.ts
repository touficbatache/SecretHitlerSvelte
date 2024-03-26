import { redirect } from "@sveltejs/kit"

import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = ({ locals }) => {
  const { user } = locals

  if (!user) {
    throw redirect(302, "/login")
  }
}
