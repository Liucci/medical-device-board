import {
  DeviceListExportUIType
} from "@/app/types/exportTypes"

import {
  exportDeviceListCsvFromApi
} from "../../exports/exportDeviceListCsv"

export async function exportDeviceListCsvTransaction(
  rows: DeviceListExportUIType[]
) {

  const blob =
    await exportDeviceListCsvFromApi(
      rows
    )

  if (!blob) {
    return
  }

  const url =
    window.URL.createObjectURL(
      blob
    )

  const link =
    document.createElement(
      "a"
    )

  link.href = url

  link.download =
    "device_list.csv"

  link.click()

  window.URL.revokeObjectURL(
    url
  )
}