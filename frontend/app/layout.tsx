//アプリのルートレイアウトを定義するファイル
//ヘッダーやフッターなど、全ページ共通の要素を配置するためのコンポーネント
import "./globals.css" 
import { AuthProvider }from "./contexts/AuthContext"
import ContextMenuBlocker from "./components/common/ContextMenuBlocker"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
return (
<html lang="ja">
  <head>

    {/* 
      Google Fontsから
      BIZ UDゴシックを読み込む。

      医療現場での視認性向上と、
      PCごとの差異を減らす目的。
    */}
    <link
      href="https://fonts.googleapis.com/css2?family=BIZ+UDGothic&display=swap"
      rel="stylesheet"
    />

  </head>

  <body>
    <ContextMenuBlocker />
    {/* ログイン中ユーザー情報をapp全体で共有するProvider。*/}
    <AuthProvider>

      {children}

    </AuthProvider>

    {/* React Portal用のmodal描画専用DOM。*/}
    <div id="modal-root"></div>

  </body>

</html>
)
}