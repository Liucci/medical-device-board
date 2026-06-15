import { API_BASE_URL } from "../client"

export const refreshToken = async () => {

  const refreshToken =
    localStorage.getItem("refresh_token")

  if (!refreshToken) {return null}

  const response =
    await fetch(
                `${API_BASE_URL}/refresh-token`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json"
                            },
                  body: JSON.stringify({
                                          refresh_token: refreshToken
                                        })
                }
              )

  if (!response.ok) {return null}

  const data = await response.json()

  localStorage.setItem(
                          "access_token",
                          data.access_token
                        )

  localStorage.setItem(
                          "refresh_token",
                          data.refresh_token
                        )

  return data
}