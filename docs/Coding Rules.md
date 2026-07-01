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

## 最終更新日時表示機能追加

### 概要

ストックエリアおよび病棟エリアに、それぞれの最終更新日時を表示する機能を追加。

---

### 更新対象

最終更新日時は **機器移動（Move系Transaction）** を更新対象とする。

対象Transaction

* Stock → Room
* Room → Stock
* Room → Room
* Stock → Stock

移動処理時に `move_device()` が必ず実行されるため、更新日時管理を `move_device()` に集約した。

---

### Backend

#### devices テーブル

以下のカラムを使用。

* `updated_at`
* `updated_by`

#### move_device

機器移動時に更新日時・更新ユーザーを自動更新するよう修正。

* `updated_at`：現在時刻（UTC）
* `updated_by`：実行ユーザーID

これにより、全Move系Transactionで自動的に更新日時が記録される。

---

### CRUD追加

追加CRUD

* `fetch_stock_last_updated`
* `fetch_ward_last_updated`

役割

* hospital_id を受け取り、各エリアの最新 `updated_at` を取得する。
* `status = stock`
* `status = room`

それぞれ `updated_at` 降順で1件取得する。

---

### Route追加

追加API

* `GET /stock-last-updated`
* `GET /ward-last-updated`

認証ユーザーから hospital_id を取得し、CRUDを呼び出して最新更新日時を返す。

---

### Frontend

追加API

* `fetchStockLastUpdated`
* `fetchWardLastUpdated`

Mapper追加

* `normalizeStockLastUpdated`
* `normalizeWardLastUpdated`

---

### Dashboard

Dashboard(page.tsx) に以下Stateを追加。

* stockLastUpdated
* wardLastUpdated

初回Dashboard表示時に取得。

さらに各Move処理完了後

* handleDropToWard
* handleDropToStock

から再取得し、画面へ即時反映する。

Dashboardの状態管理は page.tsx のみに集約し、Transaction側ではStateを保持しない構成とした。

---

### UI

表示位置

* 「病棟一覧」の右側
* 「ストックエリア一覧」の右側

表示形式

```
最終更新：2026/07/01 12:34
```

共通関数 `formatDateTime()` を利用して表示形式を統一。

---

### 設計方針

* 更新対象はMove系のみ
* 更新日時管理は `move_device()` に集約
* DashboardのState管理は page.tsx に集約
* TransactionはAPI通信・データ更新のみ担当
* UIはProps経由で最終更新日時を受け取り表示のみ担当

責務を明確に分離することで、将来的に Supabase Realtime を導入した場合も、更新日時取得処理を再利用できる構成とした。
