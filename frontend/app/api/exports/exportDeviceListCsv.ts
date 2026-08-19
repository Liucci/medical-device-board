import {
  DeviceListExportUIType
} from "@/app/types/exportTypes"

import {
  DeviceListExportDBMapper
} from "@/app/utils/exportMapper"

import { API_BASE_URL ,}from "../client/apiClient"


export async function exportDeviceListCsvFromApi(
                                                rows: DeviceListExportUIType[],
                                                showPatientName: boolean
                                                )
 {
  console.log("exportDeviceListCsv")

  const request = {
                    rows:rows.map(DeviceListExportDBMapper),
                    show_patient_name: showPatientName
                  }

  console.log("row count:",request.rows.length)

  const response = await fetch(
                      `${API_BASE_URL}/export-device-list-csv`,
                        {
                          method: "POST",
                          headers: {
                                    "Content-Type":
                                    "application/json"
                          },
                          credentials: "include",
                          body:
                            JSON.stringify(
                              request
                            )
                        }
                      )

  return await response.blob()
}