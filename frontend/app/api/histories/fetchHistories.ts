import { API_BASE_URL,authFetch } from "../client/apiClient"
import { normalizeHistory } from "@/app/utils/historyMapper"
export async function getHistoriesFromApi()
 {
    console.log("fetchHistories")

    const response = await fetch(
                        `${API_BASE_URL}/histories`,
                        {
                          method: "GET",
                          headers: {
                                    "Content-Type":
                                    "application/json"
                                    },
                        credentials: "include",
                        }
                      )
    //backからうけ情報受け取る
    return await response.json()
}