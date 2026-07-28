import { History }
from "@/app/types/historyTypes"

import { toExportHistoriesRequest }
from "@/app/utils/exportMapper"
import { API_BASE_URL,authFetch} from "../client/apiClient"

export async function exportHistoryPdfFromApi(
                                                histories: History[],
                                                showPatientName: boolean
                                              )
{
  console.log("exportHistoryPdf")
console.log("showPatientName =", showPatientName)
//debug用　front⇒back時に渡しているデータをみる
  const request = toExportHistoriesRequest(
                                            histories,
                                            showPatientName
                                          )
  console.log("front to back request")
  //console.log("row count:", request.rows.length)
  console.log(
              JSON.stringify(
                            request,
                            null,
                            2
                          )
              )

  const response = await authFetch(
                                `${API_BASE_URL}/export-history-pdf`,
                                {
                                  method: "POST",
                                  headers: {
                                            "Content-Type":
                                            "application/json"
                                            },
                                  body: JSON.stringify(
                                                          toExportHistoriesRequest(
                                                                                    histories,
                                                                                    showPatientName
                                                                                  )
                                                        )
                                }
                              )

  return await response.blob()
}