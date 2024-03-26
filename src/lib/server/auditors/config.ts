import {
  auditBoolean,
  auditFunction,
  auditHttpUrl,
  auditRequire,
  auditSetNullish,
  auditString,
  auditStringToBoolean,
  auditStringToNumber,
  auditSwitch,
  auditTrimString,
  cleanAudit,
  type Audit,
  auditObject,
  auditNumber,
  auditEmail,
  auditChain,
  auditTest,
} from "@auditors/core"

const urlRegExp =
  /^(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)|localhost(?::\d{2,5})?(?:[/?#]\S*)?$/i

const auditUrl = auditChain(
  auditTrimString,
  auditTest((data) => urlRegExp.test(data), "Invalid URL"),
)

const auditStringToObject = auditFunction((data) => JSON.parse(data))

export function auditConfig(audit: Audit, dataUnknown: unknown): [unknown, unknown] {
  if (dataUnknown == null) {
    return [dataUnknown, null]
  }
  if (typeof dataUnknown !== "object") {
    return audit.unexpectedType(dataUnknown, "object")
  }

  const data = { ...dataUnknown }
  const errors: { [key: string]: unknown } = {}
  const remainingKeys = new Set(Object.keys(data))

  audit.attribute(
    data,
    "apiURL",
    true,
    errors,
    remainingKeys,
    auditHttpUrl,
    // Ensure there is a single trailing "/" in URL.
    auditFunction((url) => url.replace(/\/$/, "") + "/"),
    auditRequire,
  )

  // booleans
  for (const key of ["devMode"]) {
    audit.attribute(
      data,
      key,
      true,
      errors,
      remainingKeys,
      auditSwitch([auditTrimString, auditStringToBoolean], auditBoolean),
      auditSetNullish(false),
      auditRequire,
    )
  }

  for (const key of ["recaptchaSiteKey"]) {
    audit.attribute(
      data,
      key,
      true,
      errors,
      remainingKeys,
      auditSwitch([auditTrimString, auditString]),
      auditSetNullish(false),
      auditRequire,
    )
  }

  audit.attribute(
    data,
    "firebaseAppConfig",
    true,
    errors,
    remainingKeys,
    auditStringToObject,
    auditObject({
      apiKey: auditTrimString,
      authDomain: auditUrl,
      databaseURL: auditHttpUrl,
      projectId: auditTrimString,
      storageBucket: auditUrl,
      messagingSenderId: auditSwitch([auditTrimString, auditStringToNumber], auditNumber),
      appId: auditTrimString,
      measurementId: auditTrimString,
    }),
    auditRequire,
  )

  audit.attribute(
    data,
    "firebaseServerConfig",
    true,
    errors,
    remainingKeys,
    auditStringToObject,
    auditObject({
      type: auditTrimString,
      project_id: auditTrimString,
      private_key_id: auditTrimString,
      private_key: auditTrimString,
      client_email: auditEmail,
      client_id: auditSwitch([auditTrimString, auditStringToNumber], auditNumber),
      auth_uri: auditHttpUrl,
      token_uri: auditHttpUrl,
      auth_provider_x509_cert_url: auditHttpUrl,
      client_x509_cert_url: auditHttpUrl,
      universe_domain: auditUrl,
    }),
    auditRequire,
  )

  return audit.reduceRemaining(data, errors, remainingKeys)
}

export function validateConfig(data: unknown): [unknown, unknown] {
  return auditConfig(cleanAudit, data)
}
