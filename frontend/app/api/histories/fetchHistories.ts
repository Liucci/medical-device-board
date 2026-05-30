import { API_BASE_URL } from "../client"
import { normalizeHistory } from "@/app/utils/historyMapper"
export async function getHistoriesFromApi()
 {
    console.log("fetchHistories")
    const token =localStorage.getItem("access_token")
    if (!token) {return}
    const response = await fetch(
                        `${API_BASE_URL}/histories`,
                        {
                          method: "GET",
                          headers: {
                                      Authorization:
                                        `Bearer ${token}`
                                    }
                        }
                      )
    //backからうけ情報受け取る
    return await response.json()
}