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
    document.createElement( "a" )

  link.href = url



  const now = new Date()

  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const dd = String(now.getDate()).padStart(2, "0")
  const hh = String(now.getHours()).padStart(2, "0")
  const min = String(now.getMinutes()).padStart(2, "0")

  link.download = `device_list_${yyyy}${mm}${dd}_${hh}${min}.csv`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}