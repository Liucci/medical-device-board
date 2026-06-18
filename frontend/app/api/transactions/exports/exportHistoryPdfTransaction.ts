import { exportHistoryPdfFromApi }
from "../../exports/exportHistoryPdf"

import { History }
from "@/app/types/historyTypes"

export async function exportHistoryPdfTransaction(
                                                    histories: History[]
                                                  )
{
  const blob = await exportHistoryPdfFromApi(
                                               histories
                                             )

  if (!blob) {return}

  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")

  link.href = url

  link.download = "histories.pdf"

  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}