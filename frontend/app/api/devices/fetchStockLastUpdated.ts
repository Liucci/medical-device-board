<<<<<<< HEAD
import { API_BASE_URL, authFetch } from "../client/apiClient"
=======
import { API_BASE_URL, authFetch } from "../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { StockLastUpdatedResponse } from "@/app/types/deviceTypes"
import { normalizeStockLastUpdated } from "../../utils/deviceMapper"

export async function fetchStockLastUpdated(): Promise<StockLastUpdatedResponse> {

    console.log("fetchStockLastUpdated")

    const response = await authFetch(
                            `${API_BASE_URL}/stock-last-updated`,
                            {
                                method: "GET",
                                headers: {
                                        "Content-Type":
                                        "application/json"
                                }
                            }
                        )

    const data = await response.json()

    return normalizeStockLastUpdated(data.updated_at)
}