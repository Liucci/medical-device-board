import { API_BASE_URL, authFetch } from "../client/apiClient"
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