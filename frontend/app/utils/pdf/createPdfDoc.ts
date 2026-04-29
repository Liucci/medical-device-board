import jsPDF from "jspdf"
// ===== 日本語font取得 =====
export const createPdfDoc = async () => {

  const doc = new jsPDF({
    orientation: "landscape"
  })

  // ===== Regular =====
  const regularResponse = await fetch(
    "/fonts/NotoSansJP-Regular.ttf"
  )

  const regularArrayBuffer =
    await regularResponse.arrayBuffer()

  let regularBinary = ""

  const regularBytes =
    new Uint8Array(regularArrayBuffer)

  for (let i = 0; i < regularBytes.length; i++) {

    regularBinary +=
      String.fromCharCode(
        regularBytes[i]
      )

  }

  const regularBase64 =
    btoa(regularBinary)

  // ===== Bold =====
  const boldResponse = await fetch(
    "/fonts/NotoSansJP-Bold.ttf"
  )

  const boldArrayBuffer =
    await boldResponse.arrayBuffer()

  let boldBinary = ""

  const boldBytes =
    new Uint8Array(boldArrayBuffer)

  for (let i = 0; i < boldBytes.length; i++) {

    boldBinary +=
      String.fromCharCode(
        boldBytes[i]
      )

  }

  const boldBase64 =
    btoa(boldBinary)

  // ===== font登録 =====
  doc.addFileToVFS(
    "NotoSansJP-Regular.ttf",
    regularBase64
  )

  doc.addFont(
    "NotoSansJP-Regular.ttf",
    "NotoSansJP",
    "normal"
  )

  doc.addFileToVFS(
    "NotoSansJP-Bold.ttf",
    boldBase64
  )

  doc.addFont(
    "NotoSansJP-Bold.ttf",
    "NotoSansJP",
    "bold"
  )

  doc.setFont("NotoSansJP")

  return doc
}