<script lang="ts">
  import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
  import { onMount } from "svelte"

  import { browser } from "$app/environment"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import { app } from "$lib/firebase"
  import Logo from "$lib/components/Logo.svelte"
  import PinInput from "$lib/components/PinInput.svelte"
  import SHTextField from "$lib/components/SHTextField.svelte"
  import SHButton from "$lib/components/SHButton.svelte"

  let auth
  let recaptchaVerifier

  let error = ""

  let isSendingOTP = false
  let isOTPSent = false
  let isSigningIn = false

  let phoneNumber = ""
  let otp = ""

  let confirmationResult

  $: if (browser) {
    if ($page.data.user) {
      goto("/")
    }
  }

  $: isButtonEnabled =
    !isSendingOTP &&
    !isSigningIn &&
    (!isOTPSent ? phoneNumber.trim().length > 0 : otp.trim().length > 0)

  onMount(() => {
    // Get a reference to the Auth instance
    auth = getAuth(app)

    // Create and pre-render the Recaptcha Verifier
    recaptchaVerifier = new RecaptchaVerifier(auth, "btn-sign-in", { size: "invisible" })
    recaptchaVerifier.render()
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
    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      .then((confirmationRes) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        confirmationResult = confirmationRes
        isOTPSent = true
        isSendingOTP = false
        // console.log("success send otp")
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

    confirmationResult
      .confirm(otp)
      .then((userCredential) => {
        // User signed in successfully.
        userCredential.user
        // console.log("success sign in")
        // console.log(userCredential.user)
      })
      .catch((e) => {
        // User couldn't sign in (bad verification code?)
        if (e.code === "auth/invalid-verification-code") {
          error = "Invalid OTP"
        } else {
          error = e.message
        }
        console.error(e)
      })
  }
</script>

<div class="w-full h-full px-12 py-36 md:py-24 flex flex-col justify-between">
  <Logo />

  <div class="w-full flex flex-col items-center gap-4">
    <span class="text-xl text-center text-on-background text-opacity-70">
      {#if !isOTPSent}
        Sign in
      {:else}
        Enter OTP for {phoneNumber}
      {/if}
    </span>

    <div class="self-stretch flex flex-col gap-1">
      {#if !isOTPSent}
        <SHTextField
          label="Phone number"
          type="tel"
          placeholder="+1 23 456 789"
          bind:value={phoneNumber}
          on:input={onInput}
        />
      {/if}

      {#if isOTPSent}
        <!--        <PinInput-->
        <!--          inactiveClass="bg-button-500 text-sh-yellow-500"-->
        <!--          activeClass="bg-sh-yellow-500 bg-opacity-70 text-sh-yellow-500 border-2 border-sh-yellow-500 border-opacity-70"-->
        <!--          bind:pin={otp}-->
        <!--        />-->
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
      <SHButton
        id="btn-sign-in"
        extraClasses="w-full"
        enabled={isButtonEnabled}
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
      </SHButton>
    </div>
  </div>
</div>

<style>
  .recaptcha-container > div {
    @apply contents;
  }
</style>
