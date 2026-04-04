/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    //tailwindcssはCSSを使用している要素を対象にCSSスタイルを生成する
    //対象のファイルを指定
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        //bgとfg、背景色と前景色を表す変数を使用できるようにする
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
}