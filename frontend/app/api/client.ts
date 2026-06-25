import { refreshToken } from "./auth/refreshToken"


export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_URL!
    : process.env.NEXT_PUBLIC_PROD_API_URL!;


// ★ 関数外へ移動
let refreshPromise: Promise<any> | null = null
export async function authFetch(
                                url: string,
                                options: RequestInit = {}
                              ) {
  
  console.log( "[START REFRESH]",url)
  //token取得
  let token =localStorage.getItem("access_token")
    console.log( "authFtch access_token",token)

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

if (response.status === 401) {

  if (!refreshPromise) {
    refreshPromise = refreshToken()
      .finally(() => {
        refreshPromise = null
      })
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
        Authorization: `Bearer ${token}`
      }
    }
  )
}
  return response
}