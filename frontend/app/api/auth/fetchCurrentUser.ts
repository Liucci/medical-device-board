import { API_BASE_URL } from "../client"
import { refreshToken } from "./refreshToken"

export const fetchCurrentUser = async () => {

  const token = localStorage.getItem("access_token")

  if (!token) {return null}

  let response = await fetch(
    `${API_BASE_URL}/current-user`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  // ←ここでrefresh
  if (!response.ok) {

    const refreshed = await refreshToken()

    if (!refreshed) {
      return null
    }

    response = await fetch(
      `${API_BASE_URL}/current-user`,
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("access_token")}`
        }
      }
    )

    if (!response.ok) {
      return null
    }
  }

  return await response.json()
}