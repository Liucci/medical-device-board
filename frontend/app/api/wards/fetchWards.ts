import { API_BASE_URL } from "../client"
import { normalizeWard } from "../../utils/wardsMapper"

export async function getWardsFromApi()
{
    console.log("fetchWards")

    const token = localStorage.getItem("access_token")
    if (!token) {return}

    const response = await fetch(
                        `${API_BASE_URL}/wards`,
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