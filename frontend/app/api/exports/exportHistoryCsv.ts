import { History }from "@/app/types/historyTypes"
import {toExportHistoriesRequest}from "@/app/utils/exportMapper"
import { API_BASE_URL,authFetch }from "../client/apiClient"

export async function exportHistoryCsvFromApi(
  histories: History[]
) {

  console.log("exportHistoryCsv")

  const response = await authFetch(
    `${API_BASE_URL}/export-history-csv`,
                      {
                        method: "POST",
                        headers: {
                                  "Content-Type":
                                  "application/json"
                        },
                        body: JSON.stringify(
                          toExportHistoriesRequest(
                            histories
                          )
                        )
                      }
  )

  return await response.blob()
}