# 点検表機能 DB設計

## 1. 目的

medical-device-board の点検表機能で使用するDB構造を定義する。

-   Frontend: Next.js / React / TypeScript
-   Backend: FastAPI / Python
-   DB: Supabase / PostgreSQL
-   PDF: ReportLab想定

------------------------------------------------------------------------

## 2. DB全体構成

点検表機能は **6テーブル**で構成する。

### 点検表構造用 4テーブル

1.  `inspection_types`
2.  `inspection_item_types`
3.  `inspection_checklists`
4.  `inspection_checklist_items`

### 点検実施・実測値用 2テーブル

5.  `inspections`
6.  `inspection_results`

``` text
inspection_types
        │
        ▼
inspection_checklists
        │
        ▼
inspection_checklist_items
        │
        └──── inspection_item_types


inspections
        │
        ▼
inspection_results
```

------------------------------------------------------------------------

## 3. テーブル役割一覧

  ------------------------------------------------------------------------------------
  Table                               役割
  ----------------------------------- ------------------------------------------------
  `inspection_types`                  点検種別を管理するシステム共通マスタ

  `inspection_item_types`             点検項目の入力形式を管理するシステム共通マスタ

  `inspection_checklists`             病院・機種・型式・点検種別ごとの点検表定義

  `inspection_checklist_items`        点検表に含まれる個々の自由作成可能な点検項目

  `inspections`                       実際に実施した1回の点検記録

  `inspection_results`                1回の点検における各点検項目の実測結果
  ------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 4. 各テーブル

### 4.1 `inspection_types`

#### 役割

点検種別を管理するシステム共通マスタ。

例:

-   使用前点検
-   使用中点検
-   使用後点検
-   月次点検
-   定期点検
-   修理後点検

#### カラム

``` text
id
name
display_order
is_active
```

------------------------------------------------------------------------

### 4.2 `inspection_item_types`

#### 役割

点検項目の入力形式を管理するシステム共通マスタ。

Frontendでは `item_type_id` に応じて入力コンポーネントを切り替える。

#### カラム

``` text
id
name
description
is_active
```

#### 想定入力形式

-   OK/NG
-   数値
-   テキスト
-   Yes/No
-   チェックボックス
-   プルダウン
-   日付
-   時刻

将来的に写真、電子署名、バーコード読取、QRコード読取などを追加できる。

------------------------------------------------------------------------

### 4.3 `inspection_checklists`

#### 役割

病院ごとの点検表定義。

病院・機種・型式・点検種別に紐付ける。

同一型式でも複数の点検表を持つことができる。

例:

``` text
A病院 / Servo-i / 使用前点検
A病院 / Servo-i / 使用中点検
A病院 / Servo-i / 使用後点検
A病院 / Servo-i / 月次点検
```

#### カラム

``` text
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

`device_model_id` はNULLを許容する。

#### リレーション

``` text
hospital_id
    → hospitals.id

inspection_type_id
    → inspection_types.id

device_type_id
    → device_types.id

device_model_id
    → device_models.id
```

------------------------------------------------------------------------

### 4.4 `inspection_checklist_items`

#### 役割

点検表に含まれる各点検項目。

点検項目はユーザーが自由に作成できる。

-   項目追加
-   項目編集
-   項目削除
-   表示順変更
-   ドラッグ＆ドロップによる並び替え

を想定する。

#### カラム

``` text
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

#### リレーション

``` text
checklist_id
    → inspection_checklists.id

item_type_id
    → inspection_item_types.id
```

`options` はプルダウン等の選択肢をJSONBで保持する。

例:

``` json
["正常", "要確認", "異常"]
```

------------------------------------------------------------------------

### 4.5 `inspections`

#### 役割

実際に実施した **1回の点検** を管理する。

1行 = 1回の点検。

#### カラム

``` text
id
hospital_id
device_id
room_id
inspection_type_id
checklist_id
performed_by
performed_at
overall_result
comment
created_at
```

#### リレーション

``` text
hospital_id
    → hospitals.id

device_id
    → devices.id

room_id
    → rooms.id

inspection_type_id
    → inspection_types.id

checklist_id
    → inspection_checklists.id

performed_by
    → users.id
```

#### 設計上の注意

`device_type_id` と `device_model_id` は `inspections` に保持しない。

既存の `devices` テーブルから、

``` text
inspections.device_id
        ↓
devices
        ├── device_type_id
        └── device_model_id
```

として機種・型式を取得できるため。

また、点検実施時の場所を記録するため `room_id` を保持する。

病棟は、

``` text
inspections.room_id
        ↓
rooms
        ↓
ward
```

から取得する。

------------------------------------------------------------------------

### 4.6 `inspection_results`

#### 役割

1回の点検に含まれる各項目の実測結果。

**1項目 = 1行**で保存する。

#### カラム

``` text
id
inspection_id
checklist_item_id
value
```

#### リレーション

``` text
inspection_id
    → inspections.id

checklist_item_id
    → inspection_checklist_items.id
```

#### 例

``` text
inspection_id | checklist_item_id | value
--------------+-------------------+------
100           | 1                 | OK
100           | 2                 | NG
100           | 3                 | 1.2
```

------------------------------------------------------------------------

## 5. 既存DBとの型

既存DBに合わせて以下の型を使用する。

  カラム              型          参照先
  ------------------- ----------- --------------------
  `hospital_id`       `uuid`      `hospitals.id`
  `device_id`         `integer`   `devices.id`
  `room_id`           `integer`   `rooms.id`
  `device_type_id`    `integer`   `device_types.id`
  `device_model_id`   `integer`   `device_models.id`
  `performed_by`      `uuid`      `users.id`

------------------------------------------------------------------------

## 6. RLS方針

### 基本方針

点検表構造4テーブルは、全ユーザーが参照できるが、変更はadminのみ。

点検実施・実測値2テーブルは、認証済みユーザーが自病院のデータを操作できる。

  -----------------------------------------------------------------------------------------------------------
  Table                          SELECT                 INSERT            UPDATE            DELETE
  ------------------------------ ---------------------- ----------------- ----------------- -----------------
  `inspection_types`             authenticated          admin             admin             admin

  `inspection_item_types`        authenticated          admin             admin             admin

  `inspection_checklists`        authenticated + 自病院 admin + 自病院    admin + 自病院    admin + 自病院

  `inspection_checklist_items`   authenticated +        admin + 自病院    admin + 自病院    admin + 自病院
                                 親checklistが自病院                                        

  `inspections`                  authenticated + 自病院 authenticated +   authenticated +   authenticated +
                                                        自病院            自病院            自病院

  `inspection_results`           authenticated +        authenticated +   authenticated +   authenticated +
                                 親inspectionが自病院   自病院            自病院            自病院
  -----------------------------------------------------------------------------------------------------------

### 自病院判定

既存DBで使用している以下の方式を基本とする。

``` sql
hospital_id IN (
    SELECT users.hospital_id
    FROM users
    WHERE users.id = auth.uid()
)
```

`inspection_checklist_items` は `hospital_id`
を直接持たないため、`inspection_checklists` を経由して自病院か判定する。

`inspection_results` は `hospital_id` を直接持たないため、`inspections`
を経由して自病院か判定する。

------------------------------------------------------------------------

## 7. データ量

想定:

-   1病院
-   稼働中100台
-   1日2回点検
-   1回20項目

``` text
inspections
100 × 2 = 200行/日

inspection_results
200 × 20 = 4,000行/日

約146万行/年
```

このため、特に `inspection_results` の検索性能を考慮する。

インデックスは、実際の検索API・検索条件を確定した後に最終決定する。

------------------------------------------------------------------------

## 8. 点検表と実施記録の分離

点検表定義と実際の点検結果は分離する。

``` text
点検表作成・編集
    ↓
inspection_checklists
inspection_checklist_items

実際の点検
    ↓
inspections
inspection_results
```

これにより、点検表の定義と過去の点検実績を独立して管理できる。

------------------------------------------------------------------------

## 9. UIとの対応

点検表作成はModalではなく、専用のエディタページを基本とする。

``` text
設定
  ↓
点検表管理
  ↓
点検表一覧
  ↓
新規作成
  ↓
点検表エディタ
```

点検項目の追加・編集など、1項目の詳細設定についてはModalを利用する。

``` text
点検表エディタ
    │
    ├─ 項目追加 → 項目編集Modal
    ├─ 項目編集 → 項目編集Modal
    └─ ドラッグ＆ドロップ → 表示順変更
```

------------------------------------------------------------------------

## 10. 実装順序

1.  DBテーブル作成
2.  RLS設定
3.  Pydantic schemas
4.  CRUD
5.  Transaction
6.  Route
7.  Front API transaction
8.  点検表作成UI
9.  点検項目入力形式UI
10. 点検項目並び替えUI
11. 点検実施UI
12. 点検結果一覧
13. 検索機能
14. PDF生成
15. 必要に応じてPDF保存

------------------------------------------------------------------------

## 11. 設計上の確定事項

-   点検表構造用4テーブル、点検実施・実測値用2テーブルの計6テーブルとする
-   病院ごとに点検表を作成できる
-   機種・型式ごとに点検表を紐付けられる
-   同一機種・型式でも複数の点検種別を持てる
-   点検項目はユーザーが自由に作成できる
-   点検項目の入力形式を指定できる
-   点検項目の並び順を指定できる
-   点検結果は1項目1行で保存する
-   点検実施1回を `inspections` 1行で管理する
-   `inspections` は `device_type_id` / `device_model_id`
    を保持せず、`device_id` から取得する
-   `inspections` は点検時の `room_id` を保持する
-   点検結果を様々な検索条件から検索できる
-   PDFは検索結果から生成する
-   DBを正本とし、PDF保存は必要に応じて検討する
-   患者名は必須としない
-   点検表構造4テーブルは全ユーザーが参照可能、変更はadminのみ
-   点検実施・実測値2テーブルは認証済みユーザーが自病院について操作可能
-   点検表作成UIは専用ページのエディタ方式とする
