
import { API_BASE_URL } from "../client"
import { History } from "../../types/historyTypes"
import { toDBHistory, normalizeHistory } from "../../utils/historyMapper"

type AddHistoryParams = Omit<
                               History,
                               | "id"
                             >

export async function addHistoryFromApi(
                                        params: AddHistoryParams,
                                        )
{
    console.log("addHistories")
    const token = localStorage.getItem("access_token")
    if (!token) {return}

    await fetch(
                `${API_BASE_URL}/histories`,
                {
                    method: "POST",
                    headers: {
                                "Content-Type":"application/json",
                                Authorization:
                                `Bearer ${token}`
                            },
                    body: JSON.stringify(
                            toDBHistory(params)
                        )
                }
                )
}

