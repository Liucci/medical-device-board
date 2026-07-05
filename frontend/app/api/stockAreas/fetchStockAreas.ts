
import { API_BASE_URL,authFetch} from "../client/apiClient"

export async function getStockAreasFromApi()
{
    console.log("fetchStockAreas")

    const response = await authFetch(
                        `${API_BASE_URL}/stock-areas`,
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

