import { API_BASE_URL,authFetch  } from "../../client/apiClient"

export async function getDeviceTypesFromApi()
{
    console.log("fetchDeviceTypes")

    const response = await authFetch(
                        `${API_BASE_URL}/device-types`,
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