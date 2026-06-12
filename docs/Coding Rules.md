# Coding Rules

## 基本思想

* 骨子が一目で分かる構造を最優先
* 無意味な装飾をしない
* 無意味な抽象化をしない
* 視線移動を減らす
* コードの高さを増やさない
* 短い処理は1行で書く
* 1変数だけの無意味な改行をしない
* カッコ内変数が1つの場合は改行しない
* 関数呼び出し時、各カッコ内の引数が1つだけなら1行で書く
* 無意味な空白行を禁止する
* frontendに業務ロジックを書かない
* 必要最小限のdebugだけ書く
* 必要最小限のerror handlingだけ書く
* import fromの定義は1行で記述

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

# 深いネストを避ける

## OK

```ts
const token = localStorage.getItem("access_token")
if (!token) {return}
const data = await response.json()
```

---

# 過剰な error handling を書かない

## OK

```ts
const data = await response.json()
setDevices(data)
```

---

# success wrapper を作らない

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
    "id": 1,
    "name": "ECMO"
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

# 命名ルール

## renameではなくupdateを使う

### OK

```text
updateDevice.ts
updateRoom.ts
updateStockArea.ts
```

### NG

```text
renameDevice.ts
renameRoom.ts
renameStockArea.ts
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

## Mapper適用ルール

Frontendでは Mapper(normalizeXXX) の適用箇所を統一する。

### 原則

- API Fetch関数は生データ(DB Schema形式)を返す
- normalize処理はTransaction層で実施する
- UIコンポーネントへ渡すデータは必ずFrontend Type形式とする

### 例

```ts
const devices = await getDevicesFromApi()

setDeviceList(
  devices.map(normalizeDevice)
)