# Frontend Standard Pattern

## Purpose

Frontend実装の標準構造を定義する。

新規機能は原則として本パターンに従う。

対象例

* Ward
* Room
* StockArea
* DeviceType
* DeviceModel
* MaintenanceType
* Device

---

# Frontend Architecture

```text
UI
↓
Transaction
↓
Fetch(API)
↓
Backend Route
```

---

# 1 Types Layer

例

```text
types/
└─ wardTypes.ts
```

責務

* UI型定義
* DB型定義

例

```ts
Ward
WardDB
```

---

# 2 Mapper Responsibility

Mapperは変換責務のみを持つ。

## DB → UI

例

normalizeMaintenanceType()

責務

DBレスポンスをFrontend型へ変換する。

---

## UI → API Request

例

toCreateMaintenanceTypeRequest()
toUpdateMaintenanceTypeRequest()
toDeleteMaintenanceTypesRequest()

責務

Frontend型をBackend Schema(Request)へ変換する。

---

Transaction Rule

TransactionはRequest Objectを直接組み立てない。

必ずMapperを経由する。

OK

Transaction
↓
toCreateMaintenanceTypeRequest
↓
POST

NG

Transaction
↓
body:{
  name: xxx,
  interval_days: xxx
}

# 3 Fetch Layer

例

```text
api/
└─ wards/
   └─ fetchWards.ts
```

責務

* token取得
* API呼び出し
* response取得

禁止事項

* state更新
* modal制御
* 業務ロジック

---

# 4 Transaction Layer

例

```text
api/transactions/wards/
├─ createWardTransaction.ts
├─ updateWardTransaction.ts
└─ deleteWardTransaction.ts
```

責務

* API orchestration
* fetch再取得
* state更新
* modal制御

例

```text
createWard
↓
getWardsFromApi
↓
setWards
```

---

# 5 UI Layer

例

```text
WardAreaSettingsModal.tsx
SettingsModal.tsx
ButtonPanel.tsx
page.tsx
```

責務

* ユーザー入力
* state保持
* transaction呼び出し

禁止事項

* API直接操作
* 業務ロジック

---

# State Ownership

## page.tsx

責務

```text
全体state管理
```

例

```ts
const [wards,setWards]
const [rooms,setRooms]
const [devices,setDevices]
```

---

# Modal Responsibility

例

```text
WardAreaSettingsModal.tsx
```

責務

```text
入力受付
↓
transaction呼び出し
```

例

```ts
handleAddWard()
↓
createWardTransaction()
```

---

# Fetch Responsibility

例

```ts
getWardsFromApi()
```

責務

```text
token取得
↓
fetch
↓
json取得
↓
return
```

---

# Transaction Responsibility

例

```ts
createWardTransaction()
```

責務

```text
API呼び出し
↓
再取得
↓
state更新
```

---

# Implementation Flow

新規機能は以下の順番で実装する。

```text
1 Types
↓
2 Mapper
↓
3 Fetch
↓
4 Transaction
↓
5 UI接続
```

---

# Naming Rules

## Types

```text
wardTypes.ts
roomTypes.ts
deviceTypes.ts
```

## Mapper

```text
wardsMapper.ts
roomsMapper.ts
deviceMapper.ts
```

## Fetch

```text
fetchWards.ts
fetchRooms.ts
fetchDevices.ts
```

## Transaction

```text
createWardTransaction.ts
updateWardTransaction.ts
deleteWardTransaction.ts
```

---

# Responsibility Summary

## Types

```text
Type Definition
```

## Mapper

```text
DB ↔ UI Conversion
```

## Fetch

```text
API Access
```

## Transaction

```text
State Update
API Orchestration
```

## UI

```text
User Interaction
```

---

# Reference Implementation

WardをFrontend実装の標準テンプレートとする。

新規機能はWard実装を踏襲して作成する。

# Mapper First Rule

Frontend と Backend のデータ変換は Mapper に集約する。

```text
DB
↓
Schema
↓
DBType
↓
Mapper
↓
Type
↓
UI
```

---

# Maintenance Rule

DB項目追加時は以下のみ修正する。

```text
Schema
↓
Type
↓
Mapper
```

---

# Transaction Rule

Transaction は個別項目を参照しない。

NG

```ts
toUpdateDeviceTypeRequest(
  id,
  name
)
```

OK

```ts
toUpdateDeviceTypeRequest(
  deviceType
)
```

---

Transaction は Mapper が生成した Request を送信するだけとする。

そのため DB項目追加時も Transaction の修正は原則不要とする。

---

# CRUD Rule

Create

```ts
toCreateXxxRequest()
```

Update

```ts
toUpdateXxxRequest()
```

Delete

```ts
toDeleteXxxRequest()
```

Request生成は全て Mapper が担当する。

---

# Goal

新規項目追加時は

```text
Schema
↓
Type
↓
Mapper
```

のみ修正する。

Transaction
Fetch
Modal

への影響を最小化する。


justDropped(useState)
↓
state更新が非同期
↓
clickイベントに間に合わない

isDraggingRef(useRef)
↓
同期更新
↓
イベント制御向き


drag中はclickイベントを無効化する

RoomContainer
Stock

if (isDraggingRef.current) return


# Drag Event Rule

## Modal重複防止

Drag & Drop 時、drop先の機器アイコン上で mouseup が発生すると、機器アイコンの click が発火し、複数 Modal が同時に開く場合がある。

対策として Drag 状態は useState ではなく useRef で管理する。

```text
startDrag
↓
isDraggingRef.current = true

handleMouseUp
↓
setTimeout(() => {
    isDraggingRef.current = false
}, 0)
```

機器アイコンの `onPointerUp` では Drag 中のクリックを無効化する。

```ts
if (isDraggingRef.current) return
```

適用箇所

* RoomContainer.tsx
* Stock.tsx

### 理由

`useState` は更新が非同期のため、Drag 直後の click イベント抑止に間に合わない場合がある。

イベント制御用フラグは `useRef` を使用する。
