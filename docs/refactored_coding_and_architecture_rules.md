# Coding Rules

## 基本思想

- 骨子が一目で分かる構造を最優先
- 無意味な装飾をしない
- 無意味な抽象化をしない
- 視線移動を減らす
- コードの高さを増やさない
- 短い処理は1行で書く
-1変数だけの無意味な改行をしない
- 関数呼び出し時、各カッコ内の引数が1つだけなら1行で書く
- 無意味な空白行を禁止する
- frontendに業務ロジックを書かない
- 必要最小限のdebugだけ書く
- 必要最小限のerror handlingだけ書く

---

# 1行で終わる処理は1行で書く

## OK

```ts

setStockAreas(stockAreas.map(normalizeStockArea))
const token = localStorage.getItem("access_token")
const data = await response.json()
setDevices(data)
```

---

# 無意味な空白行を禁止する

## OK

```ts
const token = localStorage.getItem("access_token")
if (!token) {return}
const response = await fetch(`${API_BASE_URL}/devices`)
const data = await response.json()
setDevices(data)
```

---

# object・type・引数は縦位置を揃える

## OK

```ts
const response = await fetch(
                                `${API_BASE_URL}/devices`,
                                {
                                  method: "POST",
                                  headers: {
                                              "Content-Type":"application/json",
                                              "Authorization":`Bearer ${token}`
                                            },
                                  body: JSON.stringify({
                                                          name: params.name,
                                                          room_id: params.roomId
                                                        })
                                }
                              )
```

---

# mapper関数は短い場合1行定義を優先する

## OK

```ts
import {StockArea,StockAreaDB} from "../types/stockTypes"

export const normalizeStockArea = (s: StockAreaDB): StockArea => ({
                                                                    id: s.id,
                                                                    hospitalId: s.hospital_id,
                                                                    name: s.name
                                                                  })

export const toDBStockArea = (s: StockArea): StockAreaDB => ({
                                                                id: s.id,
                                                                hospital_id: s.hospitalId,
                                                                name: s.name
                                                              })
```

---

# fetch関数は責務を限定する

## fetch関数の責務

- token取得
- API呼び出し
- json取得
- state更新

## OK

```ts
export async function getDevicesFromApi()
{
    console.log("fetchDevices")
    const token = localStorage.getItem("access_token")
    if (!token) {return}
    const response = await fetch(
                                    `${API_BASE_URL}/devices`,
                                    {
                                      method: "GET",
                                      headers: {
                                                  Authorization:
                                                    `Bearer ${token}`
                                                }
                                    }
                                  )
    return await response.json()
}
```

---

# 深いネストを避ける

## OK

```ts
const token = localStorage.getItem("access_token")
if (!token) {return}
const data = await response.json()
```

---

# 過剰なerror handlingを書かない

## OK

```ts
const data = await response.json()
setDevices(data)
```

---

# success wrapperを作らない

## OK

```python
return response.data
```

## NG

```python
return {
  "success": True,
  "data": response.data
}
```

---

# backendはlistをそのまま返す

## OK

```json
[
  {
    "id":1,
    "name":"ECMO"
  }
]
```

---

# debugは必要最小限にする

## OK

```ts
console.log("fetchDevices")
```

---

# update関数は汎用化する

## OK

```ts
await updateDevice({
                      deviceId: 1,
                      column: "room_id",
                      value: 12
                    })
```

---

# Structure Rules

## 基本思想

- frontendはUI orchestrationに徹する
- backendはDB abstractionに徹する
- frontendとbackendで責務を分離する
- backendはtransaction層とDB操作層を分離する
- frontendはfetch層・update層・transaction層に分離する
- transaction関数は処理の流れを明確に見せる
-

---

# Frontend Responsibility

## frontendの責務

- UI表示
- UI入力
- API呼び出し
- state更新

frontendに業務ロジックを書かない。

---

# Backend Responsibility

## backendの責務

- DB操作
- 業務ロジック
- transaction制御
- history追加
- permission制御

---

# Backend Structure

## DB操作層

責務:

- 単一table CRUD
- DB accessのみ
- transactionを持たない
- history追加しない

### 例

```text
backend/devices/
├ fetch_devices.py
├ add_devices.py
├ update_devices.py
└ delete_devices.py
```

---

## transaction層

責務:

- 複数DB操作
- history追加
- 業務フロー制御
- 状態遷移

### 例

```text
backend/transactions/
├ create_device_transaction.py
├ move_device_transaction.py
└ delete_device_transaction.py
```

---

# Frontend Structure

## fetch層

責務:

- API fetch
- response取得
- normalize
- return

---

## update層

責務:

- 単一table update
- 汎用field更新
- transactionを持たない

### OK

```ts
await updateDevice({
                      deviceId,
                      column:"room_id",
                      value:12
                    })
```

---

## transaction層

責務:

- API orchestration
- fetch再取得
- state更新
- modal close

### OK

```ts
await createDeviceTransaction(params)
await getDevicesFromApi()
onClose()
```

---

# backend update API

## 単一endpointで統一する

### OK

```python
@app.post("/update-device")
```

---

# column whitelistをbackendで制御する

## OK

```python
ALLOWED_COLUMNS = [
    "room_id",
    "stock_area_id",
    "status",
    "model",
    "type"
]
```

---

# 命名ルール

## renameではなくupdateを使う

## OK

```text
updateDevice.ts
```

## NG

```text
renameDevice.ts
```

---

# 最重要思想

## backend

```text
DB abstraction
```

## frontend

```text
UI orchestration
```

