# 点検表機能 今後の設計予定

作成日：2026-08-29

## 1. 基本方針

点検表は「点検表本体」と「複数の点検項目」から構成する。

CreateInspectionChecklistTransaction と
CreateInspectionChecklistNewVerTransaction
は、基本的に同じ入力構造を採用する。

``` text
Checklist
  └─ items[]
```

新規作成時も新Version作成時も、「1つの点検表に複数の点検項目を登録する」という構造を明確にする。

------------------------------------------------------------------------

## 2. 点検表のVersion管理

同一の点検表系列は、以下の組み合わせで識別する。

-   点検表種類（inspectionTypeId）
-   機種（deviceTypeId）
-   型式（deviceModelId）
-   点検表名（name）

同一系列の点検表を編集する場合は、既存Versionを直接変更せず、新しいVersionを作成する。

``` text
点検表
  ├─ Version 1
  ├─ Version 2
  └─ Version 3
```

点検表名は系列を識別する要素として扱う。

------------------------------------------------------------------------

## 3. 新規点検表作成時の重複チェック

重複チェックは2段階とする。

### 3.1 同じ点検表種類・機種・型式が存在する場合

以下が一致する既存点検表がある場合、

-   inspectionTypeId
-   deviceTypeId
-   deviceModelId

確認ポップアップを表示する。

> 同じ点検表種類・機種・型式で点検表がすでに存在します。追加しますか？

ユーザーが「はい」の場合は作成を続行する。

これにより、同一の機種・型式に対して複数の点検表系列を作成できる。

例：

``` text
人工呼吸器 / V60 / 使用中点検表
  ├─ CE用
  └─ 看護師用
```

### 3.2 同じ点検表名が存在する場合

以下がすべて一致する場合は作成不可とする。

-   inspectionTypeId
-   deviceTypeId
-   deviceModelId
-   name

メッセージ：

> 同じ点検表種類・機種・型式で同名の点検表が存在します。

------------------------------------------------------------------------

## 4. 点検項目の大項目（Category）

点検項目を大項目単位でグループ化する。

現時点で想定する大項目：

-   設定値
-   測定値
-   外装
-   その他

点検実施時には、大項目ごとに点検項目をまとめて表示する。

例：

``` text
【設定値】
  酸素濃度
  PEEP
  流量

【測定値】
  酸素濃度
  PEEP
  流量

【外装】
  本体外装
  電源コード

【その他】
  アラーム
```

### 4.1 大項目はマスタ化する

`inspection_item_categories` テーブルを作成する。

想定カラム：

``` text
id
hospital_id
name
display_order
is_active
```

大項目は病院ごとに設定可能とする。

------------------------------------------------------------------------

## 5. 入力方式（Item Type）

`inspection_item_types` は「点検項目をどのように入力するか」を定義する。

現時点で想定する入力方式：

-   数値
-   文字列
-   OK / NG
-   選択式

### 5.1 定型入力

「OK / NG」のような定型入力は、入力方式自体に定義されたUIとして扱う。

例：

``` text
○ OK
○ NG
```

個別の選択肢テーブルを必要としない。

### 5.2 選択式

「選択式」の場合のみ、点検項目ごとに任意の選択肢を設定できるようにする。

例：

``` text
動作モード
  ├─ CPAP
  ├─ S/T
  └─ AVAPS
```

同じ選択肢を複数の点検項目で共有するケースは少ないため、選択肢セットを共通マスタ化せず、点検項目に直接紐づける。

------------------------------------------------------------------------

## 6. 選択肢テーブル

選択式の点検項目用に、

`inspection_checklist_item_options`

テーブルを作成する。

想定カラム：

``` text
id
checklist_item_id
value
display_order
```

選択肢は `inspection_checklist_items` に紐づく。

``` text
inspection_checklist_items
        │
        └── inspection_checklist_item_options
```

`hospital_id`
は選択肢テーブルに直接持たせず、`checklist_item_id → checklist → hospital_id`
と辿れる構造を基本とする。

------------------------------------------------------------------------

## 7. 病院ごとのマスタ設定

以下のマスタは病院ごとに作成・設定できるようにする。

### 7.1 点検表種類

`inspection_types`

### 7.2 点検項目入力方式

`inspection_item_types`

### 7.3 点検項目大項目

`inspection_item_categories`

それぞれに `hospital_id` を持たせ、病院単位で設定できる構造を検討する。

------------------------------------------------------------------------

## 8. 設定Modal

病院管理者等が点検関連マスタを設定できるModalを作成する予定。

大まかな構成：

``` text
点検設定
├─ 点検表種類
├─ 入力方式
└─ 大項目
```

各設定画面で、

-   一覧表示
-   新規追加
-   編集
-   表示順変更
-   有効 / 無効

などを行える構成を検討する。

選択肢については、点検表作成・編集時の点検項目編集Modal内で設定する。

------------------------------------------------------------------------

## 9. 点検表・点検項目の関係

今後の概念構造：

``` text
hospital
  │
  ├── inspection_types
  ├── inspection_item_types
  └── inspection_item_categories


inspection_checklists
  │
  └── inspection_checklist_items
          │
          ├── category_id
          ├── item_type_id
          └── inspection_checklist_item_options
```

各要素の役割：

``` text
inspection_types
  → どんな種類の点検表か

inspection_item_categories
  → 点検項目をどの大項目に分類するか

inspection_item_types
  → その点検項目をどう入力するか

inspection_checklist_items
  → 実際に何を点検するか

inspection_checklist_item_options
  → 選択式の場合に何を選べるか
```

------------------------------------------------------------------------

## 10. 今後の実装順序

現時点では、以下の順番で実装する。

1.  CreateInspectionChecklistTransaction の Schema / Type / Mapper を
    NewVer と同じ `checklist + items[]` 構造へ統一
2.  CreateInspectionChecklistTransaction の API / Backend Transaction
    を新構造へ変更
3.  `inspection_checklist_items` に大項目（category_id）を追加
4.  `inspection_item_categories` テーブルを作成
5.  `inspection_item_types` の病院単位設定を整理
6.  `inspection_types` の病院単位設定を整理
7.  `inspection_checklist_item_options` テーブルを作成
8.  選択式入力を点検項目編集Modalへ追加
9.  点検表作成・編集画面で大項目を設定できるようにする
10. 点検実施画面で大項目ごとに点検項目をグループ表示する
11. 点検設定用Modalを作成する
12. RLS・権限を病院単位の設計に合わせて整理する

------------------------------------------------------------------------

## 11. 設計上の重要な原則

### ChecklistとItemを分離する

点検表本体の情報と、点検項目の情報を明確に分離する。

``` text
Checklist
  ├─ inspectionType
  ├─ deviceType
  ├─ deviceModel
  ├─ name
  └─ version

Items
  ├─ category
  ├─ itemType
  ├─ itemName
  ├─ displayOrder
  └─ options（選択式の場合）
```

### 入力方式と大項目を分離する

``` text
category_id
  → 「どのグループか」

item_type_id
  → 「どう入力するか」
```

この2つは別概念として扱う。

### 選択肢は点検項目固有とする

共通の選択肢セットを作らず、必要な場合のみ各点検項目に選択肢を登録する。

------------------------------------------------------------------------

## 12. 現時点で未確定の事項

以下は実装時に詳細を決定する。

-   `hospital_id` が NULL の共通マスタを許可するか
-   病院管理者と system_admin のマスタ設定権限
-   大項目・入力方式・点検表種類の削除を物理削除にするか、無効化にするか
-   大項目の並び順変更UI
-   選択肢の編集・削除UI
-   選択式で選択肢を必須にするか
-   点検項目を削除した場合の選択肢の扱い
-   Version作成時に選択肢をどのようにコピーするか

これらは実装時に既存のRLS、Transaction設計、Version管理との整合性を確認して決定する。
