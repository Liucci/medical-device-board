# Ward Backend Reference

## Purpose

WardをBackend実装のテンプレートとする。

---

# Directory Structure

```text
schemas/
└─ ward_schemas.py

wards/
├─ add_ward.py
├─ fetch_wards.py
├─ update_ward.py
└─ delete_ward.py

transactions/wards/
├─ create_ward_transaction.py
├─ update_ward_transaction.py
└─ delete_ward_transaction.py
```

---

# Schema Example

```python
class AddWardRequest(BaseModel):
    name:str

class WardResponse(BaseModel):
    id:int
    hospital_id:str
    name:str
```

---

# CRUD Example

## add_ward.py

```python
add_ward(
            name,
            hospital_id
        )
```

---

## fetch_wards.py

```python
fetch_wards(
                hospital_id
           )
```

---

## update_ward.py

```python
update_ward(
                ward_id,
                name,
                hospital_id
           )
```

---

## delete_ward.py

```python
delete_ward(
                ward_id,
                hospital_id
           )
```

---

# Transaction Example

## create_ward_transaction

```text
create_ward_transaction
↓
add_ward
```

---

## update_ward_transaction

```text
update_ward_transaction
↓
update_ward
```

---

## delete_ward_transaction

```text
delete_rooms_by_ward_id
↓
delete_ward
```

---

# Route Example

```text
GET /wards

POST /wards

POST /update-ward

POST /delete-ward
```

---

# Reusable Mapping

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
DeviceModel
```

```text
Ward
↓
MaintenanceType
```
