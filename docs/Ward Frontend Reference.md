# Ward Frontend Reference Implementation

## Purpose

Ward機能をFrontend実装の標準テンプレートとする。

新規機能は原則としてWard実装を踏襲する。

対象例

* Room
* StockArea
* DeviceType
* DeviceModel
* MaintenanceType

---

# Directory Structure

```text
types/
└─ wardTypes.ts

utils/
└─ wardsMapper.ts

api/
└─ wards/
   └─ fetchWards.ts

api/
└─ transactions/
   └─ wards/
      ├─ createWardTransaction.ts
      ├─ updateWardTransaction.ts
      └─ deleteWardTransaction.ts

components/modals/
└─ WardAreaSettingsModal.tsx

components/
└─ SettingsModal.tsx

page.tsx
```

---

# Architecture

```text
User Input
↓
WardAreaSettingsModal
↓
Ward Transaction
↓
Fetch API
↓
Backend Route
↓
DB
↓
Fetch API
↓
State Update
↓
UI Re-render
```

---




# Mapper Layer

## wardsMapper.ts

責務

```text
DB → UI変換
```

例

```ts
normalizeWard()
```

変換

```text
id
↓
wardId

hospital_id
↓
hospitalId

name
↓
wardName
```

---

# Fetch Layer

## fetchWards.ts

責務

```text
token取得
↓
GET /wards
↓
json取得
↓
return
```

禁止事項

```text
state更新
modal制御
業務ロジック
```

---

# Transaction Layer

## createWardTransaction.ts

処理

```text
入力値確認
↓
POST /wards
↓
getWardsFromApi
↓
normalizeWard
↓
setWards
↓
入力欄初期化
```

責務

```text
Ward作成
State更新
```

---

## updateWardTransaction.ts

処理

```text
入力値確認
↓
POST /update-ward
↓
getWardsFromApi
↓
normalizeWard
↓
setWards
```

責務

```text
Ward更新
State更新
```

---

## deleteWardTransaction.ts

処理

```text
確認ダイアログ
↓
POST /delete-ward
↓
getWardsFromApi
↓
setWards
↓
getRoomsFromApi
↓
setRooms
```

責務

```text
Ward削除
Room再取得
State更新
```

重要

```text
Ward削除時はRoomも削除される

そのためRoomsも再取得する
```

---

# UI Layer

## WardAreaSettingsModal.tsx

責務

```text
ユーザー入力
↓
Transaction呼び出し
```

保持State

```text
selectedWardId
newWardName
newRoomName
checkedRoomIds
```

---

## Ward追加

処理

```text
入力
↓
handleAddWard
↓
createWardTransaction
```

---

## Ward更新

処理

```text
Ward選択
↓
prompt
↓
handleUpdateWard
↓
updateWardTransaction
```

---

## Ward削除

処理

```text
Ward選択
↓
handleDeleteWard
↓
deleteWardTransaction
```

---

# Parent Component

## SettingsModal.tsx

責務

```text
WardAreaSettingsModal表示
```

役割

```text
props受け渡し
```

---

## page.tsx

責務

```text
Ward state管理
Room state管理
```

保持State

```ts
const [wards,setWards]
const [rooms,setRooms]
```

役割

```text
Single Source Of Truth
```

---

# Data Flow

## Ward作成

```text
Input
↓
createWardTransaction
↓
POST /wards
↓
getWardsFromApi
↓
normalizeWard
↓
setWards
```

---

## Ward更新

```text
Input
↓
updateWardTransaction
↓
POST /update-ward
↓
getWardsFromApi
↓
normalizeWard
↓
setWards
```

---

## Ward削除

```text
Input
↓
deleteWardTransaction
↓
POST /delete-ward
↓
getWardsFromApi
↓
setWards

getRoomsFromApi
↓
setRooms
```

---

# Frontend Golden Template

WardをFrontend実装の正解例とする。

新規機能作成時はWard実装を踏襲する。

実装順序

```text
1 Types
↓
2 Mapper
↓
3 Fetch
↓
4 Transaction
↓
5 Modal接続
↓
6 page.tsx state接続
```
