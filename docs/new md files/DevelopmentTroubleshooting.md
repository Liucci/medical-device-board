# DevelopmentTroubleshooting.md

## 1. 発生した事象

### 概要

運営用ページ（`system-admin/page.tsx`）の作成を開始した。

当初は Material UI（MUI）を使用する方針とし、以下をインストールした。

``` bash
npm install @mui/material @emotion/react @emotion/styled
```

その後、

``` bash
npm run dev
```

を実行すると、Turbopack が

``` text
▲ Next.js 16.x.x (Turbopack)
✓ Ready
○ Compiling / ...
```

のまま停止し、ブラウザには画面が表示されなかった。

さらに CPU・メモリ使用率が約90%まで上昇した。

------------------------------------------------------------------------

## 2. 実施した調査

実施した内容

-   Backend 起動確認
-   Frontend build 確認
-   MUI インストール確認
-   React / Next.js バージョン確認
-   Circular Import 確認（madge）
-   layout.tsx 確認
-   AuthContext 確認
-   Console 確認
-   package.json / package-lock.json 確認
-   Webpack 起動確認

------------------------------------------------------------------------

## 3. 調査結果

以下は正常であった。

-   Backend
-   npm run build
-   React
-   Next.js
-   AuthContext
-   layout.tsx
-   Circular Import

一方、

``` bash
next dev
```

（Turbopack）のみ異常となった。

しかし、

``` bash
next dev --webpack
```

では正常起動した。

------------------------------------------------------------------------

## 4. 原因切り分け

PC2をGitHub上の develop と完全一致させた。

``` bash
git fetch origin
git switch develop
git reset --hard origin/develop
git clean -fd
```

その結果、

``` bash
npm run dev
```

が正常起動した。

今回の問題は「PC2で当日に追加した変更」が原因で発生したことが確認できた。

最終的に PC2 を GitHub 上の develop と一致させたところ、Turbopack
でも正常起動した。

------------------------------------------------------------------------

## 5. 今後の開発方針

### ライブラリ追加

新しいライブラリは安易に導入しない。

導入前に必ず以下を確認する。

1.  ライブラリの概要
2.  導入目的
3.  メリット
4.  デメリット
5.  標準機能で代替可能か

十分に議論し、導入することを決定してからインストールする。

------------------------------------------------------------------------

### トラブル発生時

原因調査よりも先に、正常状態へ戻すことを優先する。

基本手順

``` bash
git fetch origin
git switch develop
git reset --hard origin/develop
git clean -fd
```

必要であれば

``` bash
npm install
```

を実施する。

正常起動を確認した後、必要な変更を一つずつ戻して原因を特定する。

------------------------------------------------------------------------

### Python環境

Python関連エラーが発生した場合は、

1.  仮想環境が有効か確認
2.  `where python`
3.  `pip show <package>`

を確認してから、ライブラリの再インストールを検討する。
