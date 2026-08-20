import { refreshToken } from "../api/auth/refreshToken"

let timer: ReturnType<typeof setTimeout> | null = null

type JwtPayload = {
  exp: number
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1]
    const json = JSON.parse(atob(payload))
    return json
  } catch {
    return null
  }
}

export function startAutoRefreshToken(
  accessToken: string,
  setAccessToken: (token: string) => void
) {
  console.log("startAutoRefreshToken")

  stopAutoRefreshToken()

  if (!accessToken) {
    return
  }

  const payload = decodeJwt(accessToken)

  if (!payload) {
    return
  }

  const now = Math.floor(Date.now() / 1000)

  console.log("now:", now)
  console.log("exp:", payload.exp)
  console.log("remaining:", payload.exp - now)

  const refreshAfterSec = Math.max(
    payload.exp - now - 60,
    30
  )

  console.log(
    "[Auto Refresh]",
    refreshAfterSec,
    "sec later"
  )

  timer = setTimeout(async () => {
    const newAccessToken =await refreshToken()
    if (newAccessToken) {
                        setAccessToken(newAccessToken)
      return
    }
    console.log("[Auto Refresh Failed] Logout")
    stopAutoRefreshToken()
    window.location.href = "/login"
  }, refreshAfterSec * 1000)
}

export function stopAutoRefreshToken() {
  console.log("stopAutoRefreshToken")

  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}