import {DeviceListExportUIType}from "@/app/types/exportTypes"
import {DeviceListExportDBMapper}from "@/app/utils/exportMapper"
import { API_BASE_URL,authFetch  }from "../client"


export async function exportDeviceListPdfFromApi(
                                                  rows:
                                                  DeviceListExportUIType[]
                                                )
{
  console.log("exportDeviceListPdf")

  const request = {
                    rows:
                    rows.map(
                              DeviceListExportDBMapper
                            )
                  }

  console.log("row count:",request.rows.length)

  const response = await authFetch(
                                `${API_BASE_URL}/export-device-list-pdf`,
                                {
                                  method: "POST",
                                  headers: {
                                            "Content-Type":
                                            "application/json"
                                            },
                                  body:
                                    JSON.stringify(
                                                    request
                                                  )
                                }
                              )

  return await response.blob()
}