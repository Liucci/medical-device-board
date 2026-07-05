<<<<<<< HEAD
import { API_BASE_URL } from "../client/apiClient"
import { normalizeWard } from "../../utils/wardsMapper"
import { authFetch } from "../client/apiClient"
=======
import { API_BASE_URL } from "../../client/apiClient"
import { normalizeWard } from "../../utils/wardsMapper"
import { authFetch } from "../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

export async function getWardsFromApi()
{
    console.log("fetchWards")

    const response = await authFetch(
                        `${API_BASE_URL}/wards`,
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