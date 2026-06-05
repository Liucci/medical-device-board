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

# 2 Mapper Layer

例

```text
utils/
└─ wardsMapper.ts
```

責務

* DB → UI変換
* UI → DB変換

例

```text
normalizeWard()
```

---

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
