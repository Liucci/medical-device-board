import autoTable from "jspdf-autotable"

import { createPdfDoc }
from "./pdf/createPdfDoc"

export const ExportHistoriesPdf = async (
  histories: any[]
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
    "機器履歴一覧",
    14,
    15
  )

  // ===== 通常fontへ戻す =====
  doc.setFont(
    "NotoSansJP",
    "normal"
  )

  // ===== table =====
autoTable(doc, {

  startY: 25,

  head: [[
    "日時",
    "機器ID",
    "機種",
    "型式",
    "状態",
    "配置",
    "患者",
    "内容"
  ]],

  body: histories.map(h => [

    new Date(h.created_at)
      .toLocaleString("ja-JP"),

    String(h.device_id),

    h.device_type_name ?? "-",

    h.device_model_name ?? "-",

    h.status ?? "-",

    h.room_name ??
    h.stock_area_name ??
    "-",

    h.patient_name ?? "-",

    h.message ?? "-"

  ]),

  styles: {

    font: "NotoSansJP",

    fontSize: 8,

    cellPadding: 2,

    overflow: "linebreak"

  },

  headStyles: {

    font: "NotoSansJP",

    fontStyle: "bold",

    fontSize: 10,

    fillColor: [220, 220, 220]

  },

  bodyStyles: {

    font: "NotoSansJP"

  },

  didParseCell: (data) => {

    data.cell.styles.font =
      "NotoSansJP"

  }

})
const pageCount =
  doc.getNumberOfPages()

for (
  let i = 1;
  i <= pageCount;
  i++
) {

  doc.setPage(i)

  // ===== footer font =====
  doc.setFont(
    "NotoSansJP",
    "normal"
  )

  doc.setFontSize(8)

  // ===== 印刷日時 =====
  const printedAt =
    new Date()
      .toLocaleString("ja-JP")

  doc.text(
    `印刷日: ${printedAt}`,
    14,
    200
  )

  // ===== 施設名 =====
  const hospitalName =
    "○○病院"

  const pageWidth =
    doc.internal.pageSize.getWidth()

  doc.text(
    hospitalName,
    pageWidth / 2,
    200,
    {
      align: "center"
    }
  )

  // ===== page番号 =====
  doc.text(
    `${i} / ${pageCount}`,
    pageWidth - 14,
    200,
    {
      align: "right"
    }
  )

}

  // ===== PDF保存 =====
  const now = new Date()
  const yyyy =
    now.getFullYear()
  const mm =
    String(now.getMonth() + 1)
      .padStart(2, "0")
  const dd =
    String(now.getDate())
      .padStart(2, "0")
  const hh =
    String(now.getHours())
      .padStart(2, "0")
  const min =
    String(now.getMinutes())
      .padStart(2, "0")
  const fileName =
    `履歴_${yyyy}${mm}${dd}_${hh}${min}.pdf`
  doc.save(
    fileName
  )   
}