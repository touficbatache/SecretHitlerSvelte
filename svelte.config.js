import adapter from "@sveltejs/adapter-static"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import("@sveltejs/kit").Config} */
// eslint-disable-next-line @typescript-eslint/typedef -- plain JS: typed by the JSDoc above instead
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // A static single-page app: Firebase Hosting serves the files in build/, and sends every
    // other path to index.html, where the app's router takes over (see firebase.json).
    adapter: adapter({ fallback: "index.html" }),
  },
}

export default config
