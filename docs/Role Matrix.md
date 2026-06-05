# Role Matrix

## Purpose

システム内の権限を定義する。

認可実装時は本ドキュメントを参照する。

---

# Roles

## system_admin

プラットフォーム管理者

責務

* Hospital作成
* 初期Admin作成
* システム管理
* 全Hospital参照

---

## support

サポート担当

責務

* 調査支援
* 障害対応
* データ確認

---

## admin

病院管理者

責務

* User招待
* Device設定
* Ward管理
* Room管理
* StockArea管理
* Maintenance設定

---

## normal

一般利用者

責務

* Device操作
* History記録
* Maintenance実施

---

## viewer

閲覧専用

責務

* データ閲覧のみ

---

# Permission Matrix

| Function            | viewer | normal | admin | support | system_admin |
| ------------------- | ------ | ------ | ----- | ------- | ------------ |
| View Dashboard      | ○      | ○      | ○     | ○       | ○            |
| Device Operation    | ×      | ○      | ○     | ○       | ○            |
| Record History      | ×      | ○      | ○     | ○       | ○            |
| Maintenance         | ×      | ○      | ○     | ○       | ○            |
| Manage Wards        | ×      | ×      | ○     | ○       | ○            |
| Manage Rooms        | ×      | ×      | ○     | ○       | ○            |
| Manage Stock Areas  | ×      | ×      | ○     | ○       | ○            |
| Manage Device Types | ×      | ×      | ○     | ○       | ○            |
| Invite Users        | ×      | ×      | ○     | ○       | ○            |
| Create Hospitals    | ×      | ×      | ×     | ×       | ○            |

---

# Implementation Rule

認可判定は Backend Route または Transaction 層で実施する。
