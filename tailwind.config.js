/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: [
    "font-thin",
    "font-extralight",
    "font-light",
    "font-normal",
    "font-medium",
    "font-semibold",
    "font-bold",
    "font-extrabold",
    "font-black",
  ],
  theme: {
    extend: {
      animation: {
        "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        blink: "blink 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backgroundImage: {
        "board-election-tracker": "url('/board_election_tracker.png')",
        "board-liberal": "url('/board_liberal.png')",
        "board-liberal-small-exterior": "url('/board_liberal_small_exterior.png')",
        "board-liberal-small-interior": "url('/board_liberal_small_interior.png')",
        "board-fascist-5-6": "url('/board_fascist_5_6.png')",
        "board-fascist-7-8": "url('/board_fascist_7_8.png')",
        "board-fascist-9-10": "url('/board_fascist_9_10.png')",
        "board-fascist-small-exterior": "url('/board_fascist_small_exterior.png')",
        "board-fascist-small-interior-56": "url('/board_fascist_small_interior_56.png')",
        "board-fascist-small-interior-78": "url('/board_fascist_small_interior_78.png')",
        "board-fascist-small-interior-910": "url('/board_fascist_small_interior_910.png')",
        "btn-create-game": "url('/btn_create_game.png')",
        "btn-join-game": "url('/btn_join_game.png')",
        "btn-logout": "url('/btn_logout.png')",
        "card-ballot-backcover": "url('/card_ballot_backcover.png')",
        "card-ballot-ja": "url('/card_ballot_ja.png')",
        "card-ballot-nein": "url('/card_ballot_nein.png')",
        "card-membership-backcover": "url('/card_membership_backcover.png')",
        "card-membership-liberal": "url('/card_membership_liberal.png')",
        "card-membership-fascist": "url('/card_membership_fascist.png')",
        "card-role-backcover": "url('/card_role_backcover.png')",
        "card-role-fascist-frog": "url('/card_role_fascist_frog.png')",
        "card-role-fascist-lizard": "url('/card_role_fascist_lizard.png')",
        "card-role-fascist-snake": "url('/card_role_fascist_snake.png')",
        "card-role-hitler": "url('/card_role_hitler.png')",
        "card-role-liberal-1": "url('/card_role_liberal_1.png')",
        "card-role-liberal-2": "url('/card_role_liberal_2.png')",
        "card-role-liberal-3": "url('/card_role_liberal_3.png')",
        "card-role-liberal-4": "url('/card_role_liberal_4.png')",
        "card-role-liberal-5": "url('/card_role_liberal_5.png')",
        "card-role-liberal-6": "url('/card_role_liberal_6.png')",
        checkerboard: "url('/background.png')",
        "hand-drawn-x": "url('/hand_drawn_x.svg')",
        "illustration-fascist": "url('/illustration_fascist.png')",
        "illustration-liberal": "url('/illustration_liberal.png')",
        logo: "url('/logo.png')",
        "logo-nsk": "url('/logo_nsk.png')",
        "logo-nsk-s": "url('/logo_nsk_s.png')",
        "skw-logo": "url('/skw_logo.png')",
        "skw-logo-2": "url('/skw_logo_2.png')",
        paperback: "url('/paperback.png')",
        "pile-draw": "url('/pile_draw.png')",
        "pile-discard": "url('/pile_discard.png')",
        "placard-president": "url('/placard_president.png')",
        "placard-chancellor": "url('/placard_chancellor.png')",
        player: "url('/player.png')",
        "player-fascist-frog": "url('/player_fascist_frog.png')",
        "player-fascist-lizard": "url('/player_fascist_lizard.png')",
        "player-fascist-snake": "url('/player_fascist_snake.png')",
        "player-hitler": "url('/player_hitler.png')",
        "player-liberal-1": "url('/player_liberal_1.png')",
        "player-liberal-2": "url('/player_liberal_2.png')",
        "player-liberal-3": "url('/player_liberal_3.png')",
        "player-liberal-4": "url('/player_liberal_4.png')",
        "player-liberal-5": "url('/player_liberal_5.png')",
        "player-liberal-6": "url('/player_liberal_6.png')",
        "policy-backcover": "url('/policy_backcover.png')",
        "policy-liberal": "url('/policy_liberal.png')",
        "policy-fascist": "url('/policy_fascist.png')",
      },
      backgroundSize: {
        136: "34rem",
      },
      blur: {
        xxs: "1px",
        xs: "2px",
      },
      boxShadow: {
        depth: "0px 1px 0px 4px black",
        frame:
          "inset 0px 2px 0px 0px rgba(255, 255, 255, 0.15), 0px 3px 0px 0px rgba(255, 255, 255, 0.15)",
        "frame-glowing":
          "inset 0px 2px 0px 0px rgba(255, 255, 255, 0.15), 0px 3px 0px 0px rgba(255, 255, 255, 0.15), 0 25px 50px -12px rgb(255 255 255 / 0.1)",
        "player-frame": "0px 0px 0px 5px #d7cba1",
        "card-small":
          "1px 1.3px 0px 0.5px #ececec, 2px 2.2px 0px 0.4px #9e9e9e, 3.3px 3.3px 0px 0px #ececec, 6px 2px 5px 0px rgb(0 0 0 / 22%)",
      },
      colors: {
        "on-background": "#ffffff",
        button: {
          50: "#ebebeb",
          100: "#d7d7d6",
          200: "#afafad",
          300: "#888685",
          400: "#605e5c",
          500: "#383633",
          600: "#32312e",
          700: "#2d2b29",
          800: "#22201f",
          900: "#161614",
          950: "#0b0b0a",
        },
        "on-button": {
          50: "#000000",
          100: "#000000",
          200: "#000000",
          300: "#ffffff",
          400: "#ffffff",
          500: "#ffffff",
          600: "#ffffff",
          700: "#ffffff",
          800: "#ffffff",
          900: "#ffffff",
          950: "#ffffff",
        },
        input: {
          50: "#ebebeb",
          100: "#d7d7d6",
          200: "#afafad",
          300: "#888685",
          400: "#605e5c",
          500: "#383633",
          600: "#32312e",
          700: "#2d2b29",
          800: "#22201f",
          900: "#161614",
          950: "#0b0b0a",
        },
        "on-input": {
          50: "#000000",
          100: "#000000",
          200: "#000000",
          300: "#ffffff",
          400: "#ffffff",
          500: "#ffffff",
          600: "#ffffff",
          700: "#ffffff",
          800: "#ffffff",
          900: "#ffffff",
          950: "#ffffff",
        },
        "sh-beige": "#f7e1c1",
        "sh-beige-dark": "#d7cba1",
        "sh-yellow": {
          50: "#fffcf9",
          100: "#fef9f2",
          200: "#fdf3e6",
          300: "#fdedd9",
          400: "#fce7cd",
          500: "#fbe1c0",
          600: "#e2cbad",
          700: "#c9b49a",
          800: "#978773",
          900: "#645a4d",
          950: "#322d26",
        },
        "sh-grey-less-dark": "#1a1a1a",
        "sh-grey-dark": "#141414",
        "sh-grey-very-dark": "#0f0f0f",
        "red-fascist": "#d60d00",
        "blue-liberal": "#0091b3",
      },
      darkMode: "class",
      fontFamily: {
        sans: ["Nunito Variable", "sans-serif"],
        museo: ["Museo"],
        futura: ["Futura"],
        eskapade_fraktur: ["Eskapade Fraktur"],
        nunito: ["Nunito Variable"],
      },
      keyframes: {
        blink: {
          "3.5%, 10.5%": {
            opacity: 0.9,
          },
          "7%, 14%": {
            opacity: 1,
          },
        },
        rotator: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "12.5%": {
            transform: "rotate(45deg)",
          },
          "25%": {
            transform: "rotate(90deg)",
          },
          "37.5%": {
            transform: "rotate(135deg)",
          },
          "50%": {
            transform: "rotate(180deg)",
          },
          "62.5%": {
            transform: "rotate(225deg)",
          },
          "75%": {
            transform: "rotate(270deg)",
          },
          "87.5%": {
            transform: "rotate(315deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        "card-showcase": {
          "0%, 100%": {
            "animation-timing-function": "linear",
            transform: "translateX(0) scale(1)",
          },
          "5%": {
            "animation-timing-function": "cubic-bezier(.73,.03,.99,.55)",
            transform: "translateX(-60px) scale(1)",
          },
          "10%": {
            "animation-timing-function": "cubic-bezier(.73,.03,.99,.55)",
            transform: "translateX(-100px) scale(1.5)",
          },
          "15%": {
            "animation-timing-function": "cubic-bezier(.73,.03,.99,.55)",
            transform: "translateX(-60px) scale(2)",
          },
          "85%": {
            "animation-timing-function": "linear",
            transform: "translateX(80px) scale(2)",
          },
          "90%": {
            "animation-timing-function": "linear",
            transform: "translateX(100px) scale(1.5)",
          },
          "95%": {
            "animation-timing-function": "linear",
            transform: "translateX(80px) scale(1)",
          },
        },
        "cs-pos": {
          "0%": {
            transform: "translateX(0)",
          },
          "10%": {
            "animation-timing-function": "ease-in",
            transform: "translateX(-200px)",
          },
          "80%": {
            transform: "translateX(200px)",
          },
        },
        "cs-siz": {
          "0%": {
            transform: "scale(1) rotateY(0deg)",
          },
          "30%, 72%": {
            // "animation-timing-function": "cubic-bezier(.35,.65,.47,.85)",
            // "animation-timing-function": "cubic-bezier(.5,.93,.58,1)",
            transform: "scale(1.5) rotateY(180deg)",
          },
        },
        "cs-siz-reverse": {
          "0%": {
            transform: "scale(1) rotateY(180deg)",
          },
          "30%, 72%": {
            transform: "scale(1.5) rotateY(0deg)",
          },
          "100%": {
            transform: "scale(1) rotateY(0deg)",
          },
        },
        "rotate-reveal": {
          "0%": {
            transform: "rotateY(180deg)",
          },
          "10%, 80%": {
            transform: "rotateY(360deg)",
          },
          "100%": {
            transform: "rotateY(360deg)",
          },
        },
        "grow-reveal": {
          "0%": {
            "animation-timing-function": "cubic-bezier(0, 0.55, 0.45, 1)",
            transform: "scale(1)",
          },
          "70%": {
            "animation-timing-function": "cubic-bezier(.87,0,.21,1.48)",
            transform: "scale(2)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
      },
      spacing: {
        0.25: "0.0625rem",
        full: "100%",
      },
      transitionTimingFunction: {
        "material-deceleration": "cubic-bezier(0, 0, 0.2, 1)",
        "material-standard": "cubic-bezier(0.4, 0, 0.2, 1)",
        "material-acceleration": "cubic-bezier(0.4, 0, 1, 1)",
        "material-sharp": "cubic-bezier(0.4, 0, 0.6, 1)",
      },
      zIndex: {
        max: "999",
      },
    },
  },
  plugins: [],
}
