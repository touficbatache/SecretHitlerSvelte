<script lang="ts">
  import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    type Auth,
    type ConfirmationResult,
  } from "firebase/auth"
  import { onMount } from "svelte"

  import { page } from "$app/stores"
  import Logo from "$lib/components/Logo.svelte"
  import PinInput from "$lib/components/PinInput.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import PlayfulTextField from "$lib/components/PlayfulTextField.svelte"
  import TwoPaneView from "$lib/components/TwoPaneView.svelte"
  import { app } from "$lib/firebase"

  let auth: Auth

  let error: string = ""

  let isSendingOTP: boolean = false
  let isOTPSent: boolean = false
  let isSigningIn: boolean = false

  let phoneNumber: string = ""
  let otp: string = ""

  let confirmationResult: ConfirmationResult

  $: isButtonEnabled =
    !isSendingOTP &&
    !isSigningIn &&
    (!isOTPSent ? phoneNumber.trim().length > 0 : otp.trim().length === 6)

  onMount(() => {
    // Get a reference to the Auth instance
    auth = getAuth(app)

    //TODO: remove?
    if ($page.data.devMode) {
      auth.settings.appVerificationDisabledForTesting = true
    }

    // Create and pre-render the Recaptcha Verifier
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "btn-sign-in", { size: "invisible" })
  })

  function onInput() {
    error = ""
  }

  function sendOTP() {
    if (phoneNumber.length === 0) {
      error = "Please enter a phone number"
      return
    }

    if (!/^\+[0-9]+$/.test(phoneNumber)) {
      error = "You must specify the country code (+xx)"
      return
    }

    isSendingOTP = true
    signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
      .then((confirmationRes) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        confirmationResult = confirmationRes
        isOTPSent = true
        isSendingOTP = false
      })
      .catch((e) => {
        // Error: SMS not sent
        if (e.code === "auth/invalid-phone-number") {
          error = "Please enter a valid phone number"
        } else {
          error = e.message
        }
        console.error(e)
        isSendingOTP = false
      })
  }

  function confirmOTP() {
    isSigningIn = true

    // Success is handled by auth change listener
    confirmationResult.confirm(otp).catch((e) => {
      // User couldn't sign in (bad verification code?)
      if (e.code === "auth/invalid-verification-code") {
        error = "Invalid OTP"
      } else {
        error = e.message
      }
      console.error(e)
      isSigningIn = false
    })
  }
</script>

<TwoPaneView class="w-full h-full py-24 md:px-12">
  <div class="w-full h-full flex items-center px-6" slot="first">
    <Logo />
  </div>

  <form class="w-full h-full flex flex-col justify-center gap-4 px-10" slot="second">
    <span class="text-xl text-center text-on-background text-opacity-70">
      {#if !isOTPSent}
        Sign in
      {:else}
        Enter OTP for {phoneNumber}
      {/if}
    </span>

    <div class="self-stretch flex flex-col gap-1">
      {#if !isOTPSent}
        <PlayfulTextField
          bind:value={phoneNumber}
          label="Phone number"
          on:input={onInput}
          placeholder="+1 23 456 789"
          type="tel"
          validator={(value) => value.trim().replaceAll(/[^+\d]|(?!^)\+/g, "")}
        />
      {/if}

      {#if isOTPSent}
        <PinInput
          inactiveClass="bg-button-500 text-white text-opacity-80"
          activeClass="bg-white bg-opacity-70 text-white text-opacity-80 border-2 border-white border-opacity-70"
          bind:pin={otp}
        />
      {/if}

      {#if error.length > 0}
        <span class="text-[#B71C1C]">Error: {error}</span>
      {/if}
    </div>

    <div class="recaptcha-container self-stretch">
      <PlayfulButton
        id="btn-sign-in"
        extraClasses="w-full"
        enabled={isButtonEnabled}
        type="submit"
        on:click={() => {
          if (!isOTPSent) {
            sendOTP()
          } else {
            confirmOTP()
          }
        }}
      >
        {#if !isOTPSent && !isSendingOTP}
          Send OTP
        {:else if isSendingOTP}
          Sending OTP...
        {:else if !isSigningIn}
          Sign in
        {:else}
          Signing in...
        {/if}
      </PlayfulButton>
    </div>
  </form>
</TwoPaneView>

<style>
  .recaptcha-container > div {
    @apply contents;
  }
</style>
