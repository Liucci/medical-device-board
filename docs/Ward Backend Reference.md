# Ward Reference Implementation

## Purpose

Ward機能をBackend実装の標準テンプレートとする。

新規機能は原則としてWard実装を踏襲する。

対象例

* DeviceType
* DeviceModel
* Room
* StockArea
* MaintenanceType
* Device

---

# Directory Structure

```text
schemas/
└─ ward_schemas.py

wards/
├─ add_ward.py
├─ delete_ward.py
├─ fetch_wards.py
└─ update_ward.py

transactions/wards/
├─ create_ward_transaction.py
├─ delete_ward_transaction.py
└─ update_ward_transaction.py

main.py
```

---

# Schema Layer

## ward_schemas.py

```python
from pydantic import BaseModel

class AddWardRequest(BaseModel):
    name: str

class WardResponse(BaseModel):
    id: int
    hospital_id: str
    name: str

class DeleteWardRequest(BaseModel):
    id: int

class UpdateWardRequest(BaseModel):
    id: int
    name: str
```

責務

* Request定義
* Response定義

---

# CRUD Layer

## add_ward.py

```text
Insert
```

```python
add_ward(
            ward,
            hospital_id
        )
```

責務

```text
wards table insert
```

---

## fetch_wards.py

```python
fetch_wards(
                hospital_id
           )
```

責務

```text
wards table select
```

---

## update_ward.py

```python
update_ward(
                ward,
                hospital_id
           )
```

責務

```text
wards table update
```

---

## delete_ward.py

```python
delete_ward(
                ward,
                hospital_id
           )
```

責務

```text
wards table delete
```

---

# Transaction Layer

## create_ward_transaction.py

```text
create_ward_transaction
↓
add_ward
```

```python
create_ward_transaction(
                            ward,
                            hospital_id
                        )
```

責務

```text
Ward作成業務
```

---

## update_ward_transaction.py

```text
update_ward_transaction
↓
update_ward
```

```python
update_ward_transaction(
                            ward,
                            hospital_id
                        )
```

責務

```text
Ward更新業務
```

---

## delete_ward_transaction.py

```text
delete_rooms_by_ward_id
↓
delete_ward
```

```python
delete_ward_transaction(
                            ward,
                            hospital_id
                        )
```

責務

```text
Ward削除業務
関連Room削除
```

重要

```text
親子関係を考慮して子テーブルを先に削除する
```

---

# Route Layer

## GET /wards

```text
認証
↓
current_user取得
↓
権限確認
↓
fetch_wards
```

---

## POST /wards

```text
認証
↓
current_user取得
↓
create_ward_transaction
```

---

## POST /update-ward

```text
認証
↓
current_user取得
↓
権限確認
↓
update_ward_transaction
```

---

## POST /delete-ward

```text
認証
↓
current_user取得
↓
delete_ward_transaction
```

---

# Reusable Pattern

Wardを実装した後は以下を置換するだけでよい。

```text
Ward
↓
Room
```

```text
Ward
↓
StockArea
```

```text
Ward
↓
DeviceType
```

```text
Ward
↓
MaintenanceType
```


# Backend Golden Template

WardをBackend実装の正解例とする。