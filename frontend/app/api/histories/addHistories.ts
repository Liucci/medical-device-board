
import { API_BASE_URL,authFetch  } from "../client"
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

    await authFetch(
                `${API_BASE_URL}/histories`,
                {
                    method: "POST",
                    headers: {
                                    "Content-Type":
                                    "application/json"
                            },
                    body: JSON.stringify(
                            toDBHistory(params)
                        )
                }
                )
}

