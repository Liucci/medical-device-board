const fs = require("fs")

// 読み込むfont
const fontPath =
  "app/utils/fonts/NotoSansJP-Regular.ttf"

// 出力先
const outputPath =
  "app/utils/fonts/fontBase64.ts"

// fontをbase64化
const base64 = fs
  .readFileSync(fontPath)
  .toString("base64")

// ts file生成
const content = `
export const fontBase64 = \`
${base64}
\`
`

// 保存
fs.writeFileSync(outputPath, content)

console.log("fontBase64.ts generated")