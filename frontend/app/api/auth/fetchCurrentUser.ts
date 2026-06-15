import { API_BASE_URL} from "../client"


export const fetchCurrentUser = async () => {

  const token = localStorage.getItem("access_token")
  if (!token) {return null}
  const response = await fetch(
                                `${API_BASE_URL}/current-user`,
                                {
                                  headers: {
                                              Authorization: `Bearer ${token}`
                                            }
                                }
                              )
  if (!response.ok) {return null}

  return await response.json()
}