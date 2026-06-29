import {
        DeviceListExportUIType
       }
from "@/app/types/exportTypes"

import {
        exportDeviceListPdfFromApi
       }
from "../../exports/exportDeviceListPdf"


export async function exportDeviceListPdfTransaction(
                                                      rows:
                                                      DeviceListExportUIType[]
                                                    )
{
  const blob =
    await exportDeviceListPdfFromApi(
                                      rows
                                    )

  if (!blob) {return}
  const url = URL.createObjectURL(blob)

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  )

  // 新しいタブで読み込まれるまで少し待って解放
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 10000)
}