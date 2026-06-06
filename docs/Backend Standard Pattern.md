# Backend Standard Pattern

## Purpose

Backend実装の標準構造を定義する。

新規機能は原則として本パターンに従う。

対象例

* Ward
* Room
* StockArea
* DeviceType
* DeviceModel
* MaintenanceType
* Device
* History
* MaintenanceTask

---

# Backend Architecture

```text
Route
↓
Transaction
↓
CRUD
↓
Supabase
```

---

# 1 Schema Layer

例

```python
AddWardRequest
WardResponse
DeleteWardRequest
UpdateWardRequest
```

責務

* API入出力定義
* Request定義
* Response定義
* 型定義

禁止事項

* DB操作
* 業務ロジック
* transaction処理

---

# 2 CRUD Layer

例

```text
add_ward.py
delete_ward.py
fetch_wards.py
update_ward.py
```

責務

* 単一table CRUD
* Supabase操作

原則

* 1ファイル1責務
* 単一tableのみ操作する
* 他テーブルを操作しない
* 業務ロジックを書かない
:DB tableアクセスにはhospital_idの一致が必須

例

```text
add_ward.py
↓
wards table insert
```

```text
update_ward.py
↓
wards table update
```

```text
delete_ward.py
↓
wards table delete
```

```text
fetch_wards.py
↓
wards table select
```

禁止事項

* 複数table更新
* history追加
* 状態遷移
* permission制御

---

# 3 Transaction Layer

例

```text
create_ward_transaction.py
delete_ward_transaction.py
update_ward_transaction.py
```

責務

* 業務フロー制御
* 状態遷移
* 複数table操作
* history追加
* permission制御

例

```text
delete_ward_transaction

delete_rooms_by_ward_id
↓
delete_ward
```

特徴

CRUDを組み合わせて業務機能を実現する。

禁止事項

* Supabase直接操作

---

# 4 Route Layer

例

```text
GET  /wards
POST /wards
POST /delete-ward
POST /update-ward
```

責務

* API公開
* 認証
* current_user取得
* 権限確認
* transaction呼び出し

処理例

```text
Request
↓
認証
↓
current_user取得
↓
権限確認
↓
Transaction呼び出し
↓
Response
```

禁止事項

* DB操作
* 業務ロジック

---

# Implementation Flow

新規機能は以下の順番で実装する。

```text
1 Schema作成
↓
2 CRUD作成
↓
3 Transaction作成
↓
4 Route作成
```

---

# Naming Rules

## CRUD

```text
add_xxx.py
fetch_xxx.py
update_xxx.py
delete_xxx.py
```

## Transaction

```text
create_xxx_transaction.py
update_xxx_transaction.py
delete_xxx_transaction.py
```

## Route

```text
GET    /xxx
POST   /xxx
POST   /update-xxx
POST   /delete-xxx
```

---

# Responsibility Summary

## Schema

```text
Input / Output Definition
```

---

## CRUD

```text
Single Table Database Operation
```

---

## Transaction

```text
Business Logic
State Transition
History Creation
Permission Control
```

---

## Route

```text
Authentication
Authorization
Transaction Invocation
```

---

# Reference Implementation

Ward を Backend実装の標準テンプレートとする。

新規機能は Ward 実装を踏襲して作成する。
