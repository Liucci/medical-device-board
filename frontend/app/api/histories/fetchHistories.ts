<<<<<<< HEAD
import { API_BASE_URL,authFetch } from "../client/apiClient"
=======
import { API_BASE_URL,authFetch } from "../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { normalizeHistory } from "@/app/utils/historyMapper"
export async function getHistoriesFromApi()
 {
    console.log("fetchHistories")

    const response = await authFetch(
                        `${API_BASE_URL}/histories`,
                        {
                          method: "GET",
                          headers: {
                                    "Content-Type":
                                    "application/json"
                                    }
                        }
                      )
    //backからうけ情報受け取る
    return await response.json()
}