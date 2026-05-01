import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { createPdfDoc }
from "./pdf/createPdfDoc"

type Row = {
  wardName: string
  roomName: string
  status: string
  patientName: string

  typeName: string
  modelName: string

  maintenanceName: string
  maintenanceDue: string
}

export const ExportDeviceListPdf = async (
  rows: Row[]
) => {

      // ===== PDF生成 =====
  const doc = await createPdfDoc()

  // ===== title =====
  doc.setFont(
    "NotoSansJP",
    "bold"
  )
  doc.setFontSize(16)
  doc.text(
    "機器一覧",
    14,
    16
  )
  // ===== table =====
  doc.setFont(
    "NotoSansJP",
    "bold"
  )
autoTable(doc, {

  startY: 24,

  styles: {
    font: "NotoSansJP",
    fontSize: 8
  },

  headStyles: {
    font: "NotoSansJP",
    fontStyle: "bold"
  },

  bodyStyles: {
    font: "NotoSansJP"
  },

  head: [[
    "状態",
    "病棟名",
    "病室名",
    "患者名",
    "機種名",
    "型式",
    "直近期限メンテナンス"
  ]],

  body: rows.map(r => [
    r.status,
    r.wardName,
    r.roomName,
    r.patientName,
    r.typeName,
    r.modelName,
    r.maintenanceName
      ? `${r.maintenanceName}
         (${r.maintenanceDue})`
      : ""
  ])

})
  // ===== save =====

  const now = new Date()

  const fileName =
    `機器一覧_${
      now
        .toLocaleDateString("ja-JP")
        .replace(/\//g, "-")
    }.pdf`

  doc.save(fileName)

}