# 点検結果PDF 要件定義（要約）

## 基本構造
- Frontend → Backendへ`inspection_ids`を送信
- Backendで`inspections`・`inspection_results`を取得
- BackendでPDF用データを作成・PDF生成
- PDFをResponseでFrontendへ返す
- FrontendはBlobとして受け取りダウンロード
- 点検データの正はSnapshot化された`inspections`と`inspection_results`
- チェックリスト関連テーブルは参照不要
- 病院名をDBから取得する場合のみ`hospitals`を参照

## グループ化
- `checklist_id`が同一のinspectionを1つの表にまとめる

## PDFレイアウト
- A4縦／A4横を選択可能
- 上部：点検表ヘッダー
- 下部：点検結果表
- 縦：点検項目
- 横：inspection　result
- inspectionは点検日時順
- 日時ヘッダーは2行（日付・時間）
- カテゴリ・点検項目の表示順を維持
- 単位がある場合は単位をitem name末尾に（）内に表示
- 点検結果表のfont sizeは指定可能（基本6～8pt）

## 横方向の列数
- 固定値にしない
- 用紙方向・使用可能幅・font sizeから1列の必要幅を計算
- その結果から1ページの最大inspection列数を決定
- 表示しきれないinspectionは次ページへ
- 次ページでも点検表ヘッダーと日時2行を再表示
- 「最大15列程度」は目安

## フッター
- 病院名
- 作成日

## PDF生成関数の引数
```text
inspection_ids
orientation（A4縦／A4横）
font_size
hospital_name
```

- `font_size`：結果表の文字サイズ＋列幅計算に使用
- `hospital_name`：フッター表示用

## PDF生成工程
```text
InspectionResultListModal
↓ inspection_ids
Frontend Transaction
↓
Backend PDF API
↓
inspections取得
↓
inspection_results取得
↓
PDF用データ作成
↓
checklist_idでグループ化
↓
レイアウト計算
↓
PDF生成
↓
PDF Response
↓
FrontendでBlob受信
↓
ダウンロード
```
