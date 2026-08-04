import { API_BASE_URL, authFetch } from "../client/apiClient"

export async function getWardInfectionsFromApi()
{
    console.log("fetchWardInfections")

    const response = await authFetch(
                        `${API_BASE_URL}/ward-infections`,
                        {
                          method: "GET",
                          headers: {
                                    "Content-Type":
                                    "application/json"
                                   }
                        }
                      )

    return await response.json()
}