import { API_BASE_URL } from "../client"

export async function getDeviceModelsFromApi()
{
    console.log("fetchDeviceModels")

    const token = localStorage.getItem("access_token")
    if (!token) {return}

    const response = await fetch(
                        `${API_BASE_URL}/device-models`,
                        {
                          method: "GET",
                          headers: {
                                      Authorization:
                                        `Bearer ${token}`
                                    }
                        }
                      )

    return await response.json()
}