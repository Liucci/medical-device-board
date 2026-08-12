import { API_BASE_URL, authFetch } from "../client/apiClient"

export async function getInfectionTypesFromApi()
{
    console.log("fetchInfectionTypes")

    const response = await fetch(
                        `${API_BASE_URL}/infection-types`,
                        {
                          method: "GET",
                          headers: {
                                    "Content-Type":
                                    "application/json"
                                    },
                        credentials: "include",
                        }
                      )

    return await response.json()
}