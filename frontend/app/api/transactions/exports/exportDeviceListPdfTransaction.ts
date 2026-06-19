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
    "device_list.pdf"

  link.click()

  window.URL.revokeObjectURL(
                              url
                            )
}