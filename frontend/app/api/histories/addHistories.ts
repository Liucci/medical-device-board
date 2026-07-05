
<<<<<<< HEAD
import { API_BASE_URL,authFetch  } from "../client/apiClient"
=======
import { API_BASE_URL,authFetch  } from "../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
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

