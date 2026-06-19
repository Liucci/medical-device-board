import {
  exportHistoryCsvFromApi
}
from "../../exports/exportHistoryCsv"

import { History }
from "@/app/types/historyTypes"

export async function exportHistoryCsvTransaction(
  histories: History[]
) {

  const blob =
    await exportHistoryCsvFromApi(
      histories
    )

  if (!blob) { return }

  const url =
    URL.createObjectURL(blob)

  const link =
    document.createElement("a")

  link.href = url

  link.download =
    "histories.csv"

  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}