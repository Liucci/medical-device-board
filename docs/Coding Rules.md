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

---

# 処理中（Loading）表示 共通化

## 共通コンポーネント作成

### executeWithLoading

ローディング表示を共通化するため、`executeWithLoading` を作成。

役割

- setLoading(true)
- 非同期処理実行
- finallyでsetLoading(false)

各画面で `setLoading(true/false)` を直接記述しない。

---

### LoadingOverlay

処理中は画面全体を半透明オーバーレイで覆い、中央に「処理中」を表示する共通コンポーネントを作成。

---

## 実装方針

更新系処理は以下の形式へ統一する。

```ts
await executeWithLoading({
  setLoading,
  action: async () => {
    // 更新処理
  }
})
```

エラー処理は `action` 内で実装し、ローディング制御のみ共通関数へ委譲する。

---

## 適用箇所

### Settings系Modal

- 病棟設定
- 病室設定
- ストックエリア設定
- 機種設定
- 型式設定
- メンテナンスタイプ設定

### RoomDeviceInfoModal

- 患者名変更
- 管理番号変更
- シリアル番号変更
- 備考変更
- レンタル開始日変更
- レンタル返却日変更
- スタンバイ開始
- スタンバイ解除
- メンテナンス実施
- メンテナンス期限変更
- メンテナンス中止

### その他

- ストックエリア並び替え保存
- 招待コード作成

---

## 効果

- 全画面で処理中表示を統一
- 多重クリック防止
- 各画面からローディング制御を排除
- 更新処理の実装パターンを統一
- 保守性向上