# 点検表機能 設計・実装引き継ぎ資料

## 1. 目的

別チャットで点検表機能の設計・実装を継続するための引き継ぎ資料。

対象プロジェクト:
- medical-device-board
- Frontend: Next.js / React / TypeScript
- Backend: FastAPI / Python
- DB: Supabase / PostgreSQL
- PDF: ReportLab想定

## 2. 基本要件

各病院で、病院・機種・型式・点検種別ごとに自由な点検表を作成できる。

同一型式でも複数の点検表を持てる。

例:
- A病院 / Servo-i / 使用前点検
- A病院 / Servo-i / 使用中点検
- A病院 / Servo-i / 使用後点検
- A病院 / Servo-i / 月次点検

将来的に定期点検、修理後点検なども追加可能とする。

## 3. DB構造

最終的に6テーブル構成を想定。

```text
inspection_types
        │
        ▼
inspection_checklists
        │
        ▼
inspection_checklist_items
        │
        └────── inspection_item_types

inspections
        │
        ▼
inspection_results
```

### 3.1 inspection_types

点検種別マスタ。

```text
id
name
display_order
is_active
```

例:
- 使用前点検
- 使用中点検
- 使用後点検
- 月次点検
- 定期点検
- 修理後点検

### 3.2 inspection_checklists

病院ごとの点検表定義。

```text
id
hospital_id
inspection_type_id
device_type_id
device_model_id
name
version
is_active
created_at
updated_at
```

`hospital_id`で病院ごとに独立した点検表を管理する。
`device_type_id`、`device_model_id`で機種・型式に紐付ける。

### 3.3 inspection_checklist_items

点検表に含まれる各点検項目。

```text
id
checklist_id
display_order
item_name
item_type_id
required
default_value
options
unit
```

- `checklist_id`で点検表と紐付ける
- `display_order`で並び順を管理
- ユーザーが自由に項目を追加できる
- ユーザーが順番を指定できる
- ドラッグ＆ドロップによる並び替えを想定
- `item_type_id`で入力形式を指定する

### 3.4 inspection_item_types

点検項目の入力形式マスタ。

当初は`inspection_checklist_item_types`という名称も検討したが、最終的には`inspection_item_types`を推奨。

```text
id
name
description
is_active
```

入力形式例:
- OK/NG
- 数値
- テキスト
- Yes/No
- チェックボックス
- プルダウン
- 日付
- 時刻

将来的に写真、電子署名、バーコード読取、QRコード読取なども追加可能。

Frontendでは`item_type_id`に応じて入力コンポーネントを切り替える。

### 3.5 inspections

1回の点検実施。

```text
id
hospital_id
device_id
device_type_id
device_model_id
inspection_type_id
checklist_id
performed_by
performed_at
overall_result
comment
created_at
```

1行 = 1回の点検。

点検結果一覧の検索対象となる中心テーブル。

病院、機器、機種、型式、点検種別、日時、点検者などを保持する。

想定検索条件:
- 病院
- 機種
- 型式
- 病棟
- 病室
- ベッド
- 管理番号
- 点検種別
- 点検日時
- 点検者
- 患者名（使用する病院のみ）

### 3.6 inspection_results

1回の点検に含まれる各項目の結果。

```text
id
inspection_id
checklist_item_id
value
```

**1項目 = 1行**。

例:

```text
inspection_id | checklist_item_id | value
100           | 1                 | OK
100           | 2                 | NG
100           | 3                 | 1.2
```

複数回・複数病院の結果が同一テーブルに蓄積される。可変項目を扱うため意図した設計。

## 4. データ量

現在想定:
- 病棟で使用中の機器を日常点検
- 1日2回
- Stock機器も将来的に対象になる可能性があり、その場合は月1回程度

例: 1病院、稼働中100台、1日2回、20項目

```text
inspections
100 × 2 = 200行/日

inspection_results
200 × 20 = 4,000行/日
約146万行/年
```

この規模ではデータ量そのものよりインデックス設計が重要。

検討対象:
- `inspections.hospital_id`
- `inspections.device_id`
- `inspections.device_model_id`
- `inspections.performed_at`
- `inspection_results.inspection_id`
- `inspection_results.checklist_item_id`

## 5. 点検結果の考え方

点検結果のファイリング単位を患者に固定しない。

病院によって、
- 患者ごと
- 機器ごと
- 病棟ごと
- 日付ごと
- 月次点検ごと

など運用が異なる可能性がある。

そのためDBでは機器・場所・日時などの情報を持ち、画面上で様々な条件から検索できるようにする。

検索結果をPDF化することで病院ごとのファイリング方法に対応する。

## 6. 患者情報・個人情報

現在の`room` tableには患者名を格納できる項目が既に存在するが、現在の運用では患者名を入力・表示していない。

標準では患者名を必須としない。

点検結果の属性として基本的に以下を扱う。

```text
病棟
病室
ベッド
管理番号
機種
型式
点検日時
点検者
```

病院によって患者名が必要な場合は既存の患者名情報を利用することを検討する。

不要な病院ではUI/API/PDFから患者名を出さない。

重要:
**患者を主キーとするか、機器を主キーとするかをシステム全体で固定しない。**

検索条件を柔軟にすることで、病院ごとのファイリング方法に対応する。

## 7. PDF設計

### 7.1 基本方針

PDFはDBの正本ではなく、点検データから必要時に生成する帳票。

```text
DBに点検結果を保存
        ↓
必要な条件で検索
        ↓
検索結果をPDF化
```

基本的にはPDFテンプレート機能を作らない。

### 7.2 1PDFの単位

**1 PDF = 1点検種別**

例:

```text
使用中点検
```

をPDF表題として表示する。

同一PDF内に異なる点検種別を混在させない。

### 7.3 1回の点検結果

1回の点検結果を1つの塊（カード/ブロック）として表示する。

例:

```text
使用中点検

病棟　　　ICU
病室　　　301
ベッド　　B
管理番号　V-00125
機種　　　人工呼吸器
型式　　　Servo-i
点検日時　2026/07/23 09:00
点検者　　山田

外観　　　　　　OK
電源　　　　　　OK
リーク　　　　　1.2
バッテリー　　　OK
```

実際は点検項目がもっと多いためブロックは縦長になる。

### 7.4 A4レイアウト

- A4縦
- 1回の点検結果 = 1ブロック
- 1ページに複数ブロック
- 目安は1ページ約5件
- ただし項目数によって高さが変わるため固定5件ではなく、ページに収まるだけ配置
- 上から順番に配置
- 収まらなければ改ページ

### 7.5 PDFに検索条件は表示しない

検索条件は画面操作のためのもの。

PDFには検索条件そのものを印字しない。

各点検結果のブロックに、病棟・病室・ベッド・機器・日時などの実データを表示する。

## 8. PDF生成

```text
検索条件
    ↓
inspections取得
    ↓
inspection_results取得
    ↓
1件ずつ点検結果ブロック生成
    ↓
A4へ配置
    ↓
収まらなければ改ページ
    ↓
PDF
```

同一PDF内では同じ点検表・同じ点検種別の結果を扱う。

## 9. PDF保存

基本方針:

**DBを正本とし、PDFは必要時に生成する。**

病院によって毎日印刷、週単位、月単位、電子保存、紙保存、両方など運用が異なる可能性がある。

そのためPDF生成処理とStorage保存処理は分離しておく。

## 10. Frontend実装方針

現在は主に`page.tsx`にAPI呼び出し関数を書いている。

点検機能も追記可能だが、規模が大きいためAPI呼び出しを分離する方針を推奨。

想定API:
- 点検種別取得
- 点検表取得
- 点検表作成
- 点検表更新
- 点検項目追加
- 点検項目更新
- 点検項目削除
- 点検実施
- 点検結果取得
- 点検結果一覧取得
- PDF出力

`page.tsx`は画面制御に専念し、API呼び出しを`transactions/`等に分離する。

例:

```text
transactions/
  fetchInspectionTypesTransaction.ts
  fetchInspectionChecklistsTransaction.ts
  createInspectionChecklistTransaction.ts
  updateInspectionChecklistTransaction.ts
  fetchInspectionsTransaction.ts
  createInspectionTransaction.ts
  fetchInspectionResultsTransaction.ts
```

既存プロジェクトの命名規則に合わせて調整。

## 11. Backend実装方針

現在は`main.py`にrouteを直接記述している。

点検機能では`main.py`にすべて追記せず、点検専用routeを分離する。

例:

```text
main.py
    ↓
inspection router
    ↓
schemas
CRUD
transactions
```

`main.py`はrouter登録を中心にする。

例:

```python
app.include_router(inspection_router)
```

点検関連:

```text
routes/
  inspection.py
```

その下で`schemas/`、`crud/`、`transactions/`に既存のBackend Standard Patternを適用する。

## 12. Backend基本パターン

既存方針:

```text
Schema
  ↓
CRUD
  ↓
Transaction
  ↓
Route
```

単一テーブル操作はCRUD。

複数テーブルをまたぐ処理はTransaction。

点検表作成:
- `inspection_checklists`
- `inspection_checklist_items`

を同時操作する可能性があるためTransactionが適している。

点検実施:
- `inspections`
- `inspection_results`

をまとめて登録するためTransactionが適している。

## 13. 推奨実装順序

1. DBテーブル作成
2. RLS設計
3. Pydantic schemas
4. CRUD
5. Transaction
6. Route
7. Front API transaction
8. 点検表作成UI
9. 点検項目入力形式UI
10. 点検項目並び替えUI
11. 点検実施UI
12. 点検結果一覧
13. 検索機能
14. PDF生成
15. 必要に応じてPDF保存

## 14. 現時点で確定している重要事項

- 病院ごとに点検表を作成できる
- 機種・型式ごとに点検表を紐付けられる
- 同一機種・型式でも複数の点検種別を持てる
- 点検項目はユーザーが自由に作成できる
- 点検項目の入力形式をユーザーが指定できる
- 点検項目の並び順をユーザーが指定できる
- 点検結果は1項目1行で保存する
- 点検実施1回を`inspections`1行で管理する
- 点検結果を様々な検索条件から検索できる
- PDFは検索結果から生成する
- 1PDF = 1点検種別
- 1回の点検結果 = 1つのPDFブロック
- PDFはA4縦を基本とする
- PDFに検索条件自体は表示しない
- 各点検結果の属性をPDFに表示する
- DBを正本とし、PDF保存は必要に応じて検討する
- 患者名は必須ではない
- 病院ごとの運用に応じて患者情報を利用できる余地を残す
- 点検機能は既存のBackend Standard Patternに沿って独立モジュール化する
