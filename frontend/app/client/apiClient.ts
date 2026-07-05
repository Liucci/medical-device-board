<<<<<<<< HEAD:frontend/app/api/client/apiClient.ts
import {refreshToken} from "../auth/refreshToken"
========
import {refreshToken} from "../api/auth/refreshToken"
>>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897:frontend/app/client/apiClient.ts

export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_URL!
    : process.env.NEXT_PUBLIC_PROD_API_URL!

let refreshPromise: Promise<boolean> | null = null

export async function authFetch(
                                  url: string,
                                  options: RequestInit = {}
                                ) {

  let token = localStorage.getItem("access_token")
  console.log("[REQUEST]", url)

  let response = await fetch(
                              url,
                              {
                                ...options,
                                headers: {
                                            ...options.headers,
                                            Authorization: token ? `Bearer ${token}` : ""
                                          }
                              }
                            )

  if (response.status !== 401) {return response}

  console.log("[401]", url)

  if (!refreshPromise) {
    refreshPromise = refreshToken()
      .finally(() => refreshPromise = null)
  }

  const refreshed = await refreshPromise
if (!refreshed) {
    throw new Error("ログイン期限切れ")
}
  token = localStorage.getItem("access_token")

  response = await fetch(
                          url,
                          {
                            ...options,
                            headers: {
                                        ...options.headers,
                                        Authorization: token ? `Bearer ${token}` : ""
                                      }
                          }
                        )

  return response
} 