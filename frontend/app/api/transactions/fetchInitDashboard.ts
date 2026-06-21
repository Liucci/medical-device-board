import { API_BASE_URL }from "../client"
import { authFetch } from "../client"

export const fetchInitDashboard =async () => {



  const response =await authFetch(`${API_BASE_URL}/init-dashboard`,
                                  {
                                    method: "GET",
                                    headers: {
                                            "Content-Type":
                                            "application/json"
                                    }
                                  }
                                )

  const data =await response.json()

  return data
}