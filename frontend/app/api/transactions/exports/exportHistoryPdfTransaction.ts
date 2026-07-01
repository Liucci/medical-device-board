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

  const now = new Date()

  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const dd = String(now.getDate()).padStart(2, "0")
  const hh = String(now.getHours()).padStart(2, "0")
  const min = String(now.getMinutes()).padStart(2, "0")

  link.download = `histories_${yyyy}${mm}${dd}_${hh}${min}.pdf`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)


}