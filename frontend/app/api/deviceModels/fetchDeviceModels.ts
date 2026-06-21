import { API_BASE_URL } from "../client"
import { authFetch } from "../client"

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