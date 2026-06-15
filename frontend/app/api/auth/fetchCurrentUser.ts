import { API_BASE_URL } from "../client"
import { refreshToken } from "./refreshToken"

export const fetchCurrentUser = async () => {

  const token =
    localStorage.getItem("access_token")

  if (!token) {return null}

  let response = await fetch(
    `${API_BASE_URL}/current-user`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (!response.ok) {
    return null
  }

  let user = await response.json()

  if (!user) {

    const refreshed =
      await refreshToken()

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

    user = await response.json()
  }

  return user
}