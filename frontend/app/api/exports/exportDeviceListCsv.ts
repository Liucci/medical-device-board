import {
  DeviceListExportUIType
} from "@/app/types/exportTypes"

import {
  DeviceListExportDBMapper
} from "@/app/utils/exportMapper"

import { API_BASE_URL }
from "../client"

export async function exportDeviceListCsvFromApi(
  rows: DeviceListExportUIType[]
) {

  console.log("exportDeviceListCsv")

  const token =
    localStorage.getItem(
      "access_token"
    )

  if (!token) {
    return
  }

  const request = {
    rows:
      rows.map(
        DeviceListExportDBMapper
      )
  }

  console.log(
    "row count:",
    request.rows.length
  )

  const response = await fetch(
    `${API_BASE_URL}/export-device-list-csv`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization:
          `Bearer ${token}`
      },
      body:
        JSON.stringify(
          request
        )
    }
  )

  return await response.blob()
}