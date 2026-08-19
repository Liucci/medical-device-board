
import { API_BASE_URL,} from "../client/apiClient"

export async function getStockAreasFromApi()
{
    console.log("fetchStockAreas")

    const response = await fetch(
                        `${API_BASE_URL}/stock-areas`,
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

