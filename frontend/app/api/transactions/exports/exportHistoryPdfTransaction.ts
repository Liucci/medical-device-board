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