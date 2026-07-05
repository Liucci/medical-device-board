import {
  DeviceListExportUIType
} from "@/app/types/exportTypes"

import {
  DeviceListExportDBMapper
} from "@/app/utils/exportMapper"

import { API_BASE_URL ,authFetch}
<<<<<<< HEAD
from "../client/apiClient"
=======
from "../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

export async function exportDeviceListCsvFromApi(
  rows: DeviceListExportUIType[]
) {

  console.log("exportDeviceListCsv")

  const request = {
                    rows:
                      rows.map(
                        DeviceListExportDBMapper
                      )
                  }

  console.log("row count:",request.rows.length)

  const response = await authFetch(
                      `${API_BASE_URL}/export-device-list-csv`,
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