import { API_BASE_URL,  } from "../client/apiClient"

export async function getDeviceTypesFromApi()
{
    console.log("fetchDeviceTypes")

    const response = await fetch(
                        `${API_BASE_URL}/device-types`,
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