import { API_BASE_URL }
  from "../client"

export const fetchInitDashboard =
  async () => {

  const token =
    localStorage.getItem(
      "access_token"
    )

  if (!token) {

    console.error(
      "token not found"
    )

    return null
  }

  const response =
    await fetch(
      `${API_BASE_URL}/init-dashboard`,
      {
        method: "GET",
        headers: {
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
        }
      }
    )

  const data =
    await response.json()

  return data
}