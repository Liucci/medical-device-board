# inspection PDF化 要件定義

## 1. 目的
点検結果一覧画面で検索・絞り込みされた点検結果を、病院で印刷・確認しやすいPDFとして出力する。

## 2. PDF生成方式
既存の一覧PDFと同じく、Frontend側で `jsPDF` + `jspdf-autotable` を使用してPDFを生成する。

既存の `createPdfDoc.ts` を共通利用する。

`createPdfDoc.ts` は縦横を引数で指定できるようにする。

```ts
createPdfDoc("portrait")
```

でA4縦を生成する。引数省略時は既存PDFとの互換性を保つため、従来通り横向きとする。

```ts
createPdfDoc()
```

## 3. ファイル構成
```text
createInspectionPdf.ts
        ↓
createPdfDoc.ts
        ↓
jsPDF + autoTable
```

`createInspectionPdf.ts` は点検結果PDFのレイアウト・表生成を担当する。

## 4. 用紙
- A4
- 縦向き（portrait）

理由：病院では1つの点検表に最大40項目程度存在する可能性があるため、点検項目を縦方向に並べて表示する。

## 5. グループ化
PDFでは1件の `inspection_result` ごとに別セクションを作らない。

```text
同一管理番号
+
同一点検表
```

でグループ化する。

同じ機器を同じ点検表で繰り返し点検した場合、1つの表にまとめる。

## 6. 表レイアウト
```text
┌──────────────┬──────┬──────┬──────┬──────┐
│ 点検項目      │09:00 │10:00 │11:00 │12:00 │
│              │ 山田 │ 佐藤 │ 山田 │ 田中 │
├──────────────┼──────┼──────┼──────┼──────┤
│ 電源確認      │ ○    │ ○    │ ○    │ ○    │
│ 外観確認      │ ○    │ ×    │ ○    │ ○    │
└──────────────┴──────┴──────┴──────┴──────┘
```

1行目：点検項目、点検日時  
2行目：実施者

「実施者」は点検日時の直下に配置する。

## 7. 列幅
- 点検結果列：8mm固定
- 点検項目列：45mmを現時点の案とする

## 8. 1ページあたりの点検回数
A4縦の横幅から、結果列8mmを基準として表示可能な回数を計算する。

目標は約17回程度。ただし17を絶対固定値にはせず、ページ幅と余白から計算してよい。

## 9. 点検回数が多い場合
同一管理番号＋同一点検表について30回ある場合、

```text
1ページ目：17回
2ページ目：13回
```

のように分割する。

2ページ目でも同じ点検項目を繰り返し表示する。

## 10. 点検項目
点検項目は `inspection_result` の `item_name` を使用する。

PDF上ではDB上の点検項目IDではなく項目名を表示する。

同一グループ内で同じ項目名が複数回登場した場合は、1つの行としてまとめる。

## 11. 点検結果
各点検回について、

```text
inspection
    created_at
    performed_by
```

と、

```text
inspection_result
    item_name
    value
```

を組み合わせて表示する。

日時は `inspection.created_at` を使用する。結果列8mmに収まるよう、例として `09/06` と `09:00` の2行表示とする。

実施者は `inspection.performed_by` から実施者名を表示する。

## 12. 機器情報
表の上部に対象機器情報を表示する。

```text
機種：○○　型式：○○　管理番号：○○
```

必要に応じてシリアル番号も使用できる。

## 13. 点検表情報
機器情報の下に点検表情報を表示する。

```text
点検表：日常点検表　点検種別：日常点検
```

## 14. フォント
既存の `NotoSansJP` / `NotoSansJP-Bold` を使用する。

表の文字サイズは6～8pt程度。

## 15. フッター
各ページに以下を表示する。
- 印刷日時
- ページ番号

病院名については既存PDFと同様に必要に応じて表示する。

## 16. データ構造
```ts
type InspectionExportUIType = {
  managementNumber?: string | null
  serialNumber?: string | null
  deviceTypeName?: string | null
  deviceModelName?: string | null
  inspectionTypeName?: string | null
  checklistName?: string | null
  inspections: InspectionExportInspectionUIType[]
}

type InspectionExportInspectionUIType = {
  createdAt: string
  performedByName?: string | null
  results: InspectionResultExportUIType[]
}

type InspectionResultExportUIType = {
  itemName: string
  value?: string | null
}
```

Backend送信用にはsnake_caseへmapperする。

## 17. Frontend責務
`createInspectionPdf.ts` はPDF生成のみを担当し、データ取得やReact state変更は行わない。

想定フロー：

```text
InspectionResultListModal
        ↓
export用データ作成
        ↓
exportInspectionPdfTransaction
        ↓
createInspectionPdf
        ↓
doc.save()
```

## 18. 既存PDFとの整合性
既存PDFは `createPdfDoc()` を利用している。

今回も共通関数を利用する。ただし点検結果PDFだけ、

```ts
const doc = await createPdfDoc("portrait")
```

としてA4縦を指定する。

## 19. 決定済み
- A4縦
- 同一管理番号＋同一点検表でグループ化
- 点検1回を結果列1列として表示
- 結果列は8mm
- 実施者は日時の直下の行
- 表示可能な点検回数を横方向に並べる
- 多数の点検回数は複数ページに分割
- 分割後も点検項目行を繰り返す
- 点検項目はitem_nameを表示
- フォントサイズ6～8pt程度
- 既存createPdfDocを共通利用
- createPdfDocのorientationを引数指定可能にする
- 既存PDFはデフォルトlandscapeを維持

## 20. 未確定・今後確認
- 実施者名を `performed_by` からどのように解決するか
- checklistNameをどこから取得するか
- serialNumberをPDFに表示するか
- 病院名の表示位置
- 点検項目が40件程度ある場合の縦方向の改ページ方法
- PDF出力ボタンからexport用データを構築するタイミング
- `inspection_results` の取得方法

## 21. 実装順序
1. `createPdfDoc.ts` に `orientation` 引数を追加
2. `createInspectionPdf.ts` を作成
3. 点検結果のグループ化データを用意
4. `inspection` + `inspection_results` をexport用データにまとめる
5. `exportInspectionPdfTransaction.ts` から `createInspectionPdf()` を呼ぶ
6. PDF保存処理を実装
7. 1回・複数回・17回超・30回程度のケースを確認
8. 点検項目が多いケースで縦方向の改ページを確認
