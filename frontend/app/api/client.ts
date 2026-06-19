import { refreshToken } from "./auth/refreshToken"

export const API_BASE_URL =
//backend接続するためのURL、.env.localから取得
  process.env
  .NEXT_PUBLIC_API_URL

export async function authFetch(
                                url: string,
                                options: RequestInit = {}
                              ) {

  let token =localStorage.getItem("access_token")

  let response = await fetch(
                          url,
                          {
                            ...options,
                            headers: {
                              ...options.headers,
                              Authorization:
                                `Bearer ${token}`
                            }
                          }
  )

  if (response.status === 401)
    {
    const refreshed =await refreshToken()
    if (!refreshed) {
                      throw new Error(
                                        "ログイン期限切れ"
                                      )
    }

    token =localStorage.getItem("access_token")
    response = await fetch(
      url,
      {
        ...options,
        headers: {
          ...options.headers,
          Authorization:
            `Bearer ${token}`
        }
      }
    )
  }

  return response
}