import {InspectionExportUIType} from "@/app/types/exportTypes"
import {toExportInspectionRequest} from "../../mapper/exportMapper"

const API_BASE_URL =process.env.NEXT_PUBLIC_API_BASE_URL


export async function exportInspectionPdfFromApi(
  rows: InspectionExportUIType[]
) {

  const request =
    toExportInspectionRequest(rows)

  const response = await fetch(
    `${API_BASE_URL}/export-inspection-pdf`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()

    console.error(
      "exportInspectionPdfFromApi error:",
      response.status,
      errorText
    )

    throw new Error(
      `PDF export failed: ${response.status}`
    )
  }

  return await response.blob()
}