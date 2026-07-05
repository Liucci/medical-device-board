<<<<<<< HEAD
import { API_BASE_URL }from "../client/apiClient"
import { authFetch } from "../client/apiClient"
=======
import { API_BASE_URL }from "../../client/apiClient"
import { authFetch } from "../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

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