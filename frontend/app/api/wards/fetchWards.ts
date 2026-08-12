import { API_BASE_URL } from "../client/apiClient"
import { normalizeWard } from "../../utils/wardsMapper"
import { authFetch } from "../client/apiClient"

export async function getWardsFromApi()
{
    console.log("fetchWards")

    const response = await fetch(
                        `${API_BASE_URL}/wards`,
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