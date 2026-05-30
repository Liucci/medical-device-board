
import { API_BASE_URL } from "../client"

export async function getStockAreasFromApi()
{
    console.log("fetchStockAreas")
    const token = localStorage.getItem("access_token")
    if (!token) {return}

    const response = await fetch(
                        `${API_BASE_URL}/stock-areas`,
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

