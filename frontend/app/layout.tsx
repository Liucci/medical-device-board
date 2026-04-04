//アプリのルートレイアウトを定義するファイル
//ヘッダーやフッターなど、全ページ共通の要素を配置するためのコンポーネント
import "./globals.css" 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
<html lang="ja">
  <head>
{/*     // Google FontsからBIZ UDゴシックを読み込む
    //どのPCでも同じフォントで表示されるようにするため
 */}   
  <link
      href="https://fonts.googleapis.com/css2?family=BIZ+UDGothic&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    {children}
        {/* モーダル専用レイヤー */}
    <div id="modal-root"></div>
  </body>
</html>
  )
}