import { History }
from "@/app/types/historyTypes"

import { toExportHistoriesRequest }
from "@/app/utils/exportMapper"
import { API_BASE_URL } from "../client"

export async function exportHistoryPdfFromApi(
                                                histories: History[]
                                              )
{
  console.log("exportHistoryPdf")

  const token = localStorage.getItem(
                                        "access_token"
                                      )

//debug用　front⇒back時に渡しているデータをみる
  const request = toExportHistoriesRequest(histories)
  console.log("front to back request")
  console.log("row count:", request.rows.length)
  console.log(
              JSON.stringify(
                            request.rows[0],
                            null,
                            2
                          )
              )


  if (!token) {return}
  const response = await fetch(
                                `${API_BASE_URL}/export-history-pdf`,
                                {
                                  method: "POST",
                                  headers: {
                                              "Content-Type":"application/json",
                                              Authorization:`Bearer ${token}`
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