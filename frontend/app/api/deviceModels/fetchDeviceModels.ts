import { API_BASE_URL } from "../../client/apiClient"
import { authFetch } from "../../client/apiClient"

export async function getDeviceModelsFromApi()
{
    console.log("fetchDeviceModels")

    const response = await authFetch(
                        `${API_BASE_URL}/device-models`,
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