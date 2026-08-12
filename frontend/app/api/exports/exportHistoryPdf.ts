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
//debug用　front⇒back時に渡しているデータをみる
  const request = toExportHistoriesRequest(
                                            histories,
                                            showPatientName
                                          )


  const response = await fetch(
                                `${API_BASE_URL}/export-history-pdf`,
                                {
                                  method: "POST",
                                  headers: {
                                            "Content-Type":
                                            "application/json"
                                            },
                                  credentials: "include",
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