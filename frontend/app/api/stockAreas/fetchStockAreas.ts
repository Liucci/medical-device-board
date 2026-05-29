import { API_BASE_URL } from "../client"
import { normalizeStockArea } from "../../utils/stockAreaMapper"

export async function getStockAreasFromApi(setStockAreas: any)
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

    const data = await response.json()

    setStockAreas(data.map(normalizeStockArea))
}