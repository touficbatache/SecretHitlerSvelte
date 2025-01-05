export function copyToClipboard(
  text: string,
  successCallback?: () => void,
  failCallback?: () => void,
) {
  try {
    navigator.permissions
      .query({ name: "clipboard-write" as PermissionName })
      .then((result) => {
        if (result.state === "granted" || result.state === "prompt") {
          writeToClipboard(text, successCallback, failCallback)
        } else {
          console.warn("Clipboard write permission denied or unavailable.")
          failCallback?.()
        }
      })
      .catch((error) => {
        console.warn("Permission query failed, attempting to write anyway:", error)
        writeToClipboard(text, successCallback, failCallback)
      })
  } catch (error) {
    console.warn("Permissions API not supported, attempting to write directly.")
    writeToClipboard(text, successCallback, failCallback)
  }
}

function writeToClipboard(text: string, successCallback?: () => void, failCallback?: () => void) {
  navigator.clipboard
    .writeText(text)
    .then(successCallback)
    .catch((error) => {
      console.error("Clipboard write failed:", error)
      failCallback?.()
    })
}
