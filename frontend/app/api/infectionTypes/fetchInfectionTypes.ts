import { API_BASE_URL, authFetch } from "../client"

export async function getInfectionTypesFromApi()
{
    console.log("fetchInfectionTypes")

    const response = await authFetch(
                        `${API_BASE_URL}/infection-types`,
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