
import { API_BASE_URL,  } from "../client/apiClient"
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

    await fetch(
                `${API_BASE_URL}/histories`,
                {
                    method: "POST",
                    headers: {
                                    "Content-Type":
                                    "application/json"
                            },
                    credentials: "include",
                    body: JSON.stringify(
                            toDBHistory(params)
                        )
                }
                )
}

