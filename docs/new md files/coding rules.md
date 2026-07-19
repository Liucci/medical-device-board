# Coding Rules

## Purpose

本ドキュメントは、本プロジェクト全体で統一するコーディング規約を定義する。

目的は、

- 可読性向上
- 保守性向上
- AIによるコード生成品質向上
- 実装パターン統一

である。

Architecture.md で責務を定義し、本書では「書き方」のみを定義する。

---

# 基本思想

最優先事項

- 骨子が一目で分かるコードを書く
- シンプルを最優先する
- 無意味な抽象化をしない
- 視線移動を減らす
- コード量を増やさない
- 読みやすさを最優先する

---

# コーディングルール

## 1行で終わる処理は1行で書く
コーディングルールは必ず守ろう。
stateは1行、引数が一つの場合は改行しない。空白行は不要

OK

```ts
const token = localStorage.getItem("access_token")
const data = await response.json()
setDevices(devices)
```

---
## exportする関数頭に関数名をprint,consoleで出力


## 不要な空白行は禁止

NG

```ts
const token = ...



const response = ...
```

OK

```ts
const token = ...
const response = ...
const data = ...
```

---

## 早期returnを優先する

OK

```ts
if (!device?.id) return

const response = await ...
```

NG

```ts
if (device?.id) {

    ...

}
```

---

## 深いネストを作らない

OK

```ts
if (!token) return
if (!response.ok) return

setDevices(data)
```

---

## objectは縦位置を揃える

```ts
{
    id: device.id,
    name: device.name,
    roomId: device.roomId
}
```

---

## importは1行

OK

```ts
import { Device, DeviceDB } from "@/types/deviceTypes"
```

---

## 引数1個なら改行しない

OK

```ts
await fetchDevices(token)
```

NG

```ts
await fetchDevices(
    token
)
```

---

# 命名規則

## CRUD

```
add
fetch
update
delete
```

renameは禁止

NG

```
renameWard
renameRoom
```

OK

```
updateWard
updateRoom
```

---

## Transaction

```
createXXXTransaction

updateXXXTransaction

deleteXXXTransaction
```

---

## Fetch

```
fetchDevices

fetchRooms

fetchTasks
```

---

## Mapper

```
normalizeDevice

toCreateDeviceRequest

toUpdateDeviceRequest
```

---

# Mapper Rule

Mapperは変換のみ責務を持つ。

## DB → Front

```
normalizeDevice()
```

## Front → Request

```
toCreateDeviceRequest()

toUpdateDeviceRequest()

toDeleteDevicesRequest()
```

Mapperで業務ロジックを書かない。

---

# Transaction Rule

Transactionは

- API呼び出し
- State更新
- Modal制御

のみを担当する。

Request生成は禁止。

NG

```ts
body:{
    name,
    room_id
}
```

OK

```ts
body: toCreateRoomRequest(room)
```

---

# Fetch Rule

Fetchは

- Token取得
- API呼び出し
- JSON取得

のみ。

State更新禁止。

---

# UI Rule

UIは

- 入力受付
- State保持
- Transaction呼び出し

のみ。

APIを直接呼ばない。

---

# Backend Rule

CRUDは

- 単一テーブル操作

のみ。

業務ロジックは禁止。

History作成禁止。

複数テーブル更新禁止。

---

# Error Handling

必要最小限とする。

NG

```python
try:
    ...
except:
    return None
```

OK

```python
except Exception as e:
    print(e)
    raise
```

---

# Logging Rule

大量ログは禁止。

## list

```python
print(rows[:5])
```

## list(dict)

```python
for k,v in rows[0].items():
    print(k,v)
```

## JSON

```ts
console.log(rows[0])
```

---

# Loading Rule

更新処理は

```
executeWithErrorAndLoading```

を利用する。

Loading制御を各画面へ書かない。

LoadingOverlayを共通利用する。

---

# Drag Rule

Drag状態は

```
useRef
```

で管理する。

```
isDraggingRef.current = true
```

Drag中は

```
if (isDraggingRef.current) return
```

でクリックイベントを無効化する。

useStateは禁止。

---

# Update Rule

DB項目追加時は

```
Schema

↓

Type

↓

Mapper
```

のみ修正することを目標とする。

Transaction・Fetch・UIへの影響を最小化する。

---

# API Rule

Backendは

success wrapper

を返さない。

NG

```json
{
    "success": true,
    "data": ...
}
```

OK

```json
[
    ...
]
```

---

# Debug Rule

Debugは必要最低限。

開発終了後は不要なログを削除する。

---

# 共通思想

Backend

```
DB abstraction
```

Frontend

```
UI orchestration
```

---

# Goal

誰が実装しても、

- 同じ命名
- 同じ責務
- 同じ実装パターン

になることを目的とする。

本書は本プロジェクト唯一のコーディング規約とする。

# Type Rule

TypeはMapperによる変換前後のデータ構造を定義する。

camelCase・snake_caseは命名規則であり、Request・Responseを表すものではない。

RequestかResponseかは、APIの通信方向によって決定する。

## Response

GET系APIでBackendから取得したデータを表す。

```
Backend(JSON snake_case)
        ↓
XXXDBType
        ↓ normalize
XXXType(camelCase)
        ↓
UI
```

例

* CurrentUserDB → CurrentUser
* UserManagementDBType → UserManagementType
* HospitalManagementDBType → HospitalManagementType

DBTypeはBackendから受け取るJSON構造を定義する。

TypeはFrontendで使用する標準型を定義する。

## Request

POST・PUT・DELETE系APIでBackendへ送信するデータを表す。

```
UI
 ↓
XXXType(camelCase)
 ↓ Mapper
XXXRequest(snake_case)
 ↓
Backend
```

例

* CreateUserFrontType → AddUserRequest
* UpdateUserType → UpdateUserRequest
* CreateHospitalFrontType → AddHospitalRequest
* UpdateHospitalFrontType → UpdateHospitalRequest

TypeはUIで保持するデータ構造を定義する。

RequestはBackendへ送信するJSON構造を定義する。

## 共通ルール

TypeはMapperの変換前後の型を定義する。

* DBType：Backendとの通信で使用する型
* Type：Frontend内部で使用する型
* Request：Backendへ送信する型

Request・Responseの区別は、camelCase・snake_caseではなく、APIの通信方向（取得か送信か）によって決定する。

# Type / Mapper Reference

DeviceModel を Type・Mapper の標準実装（リファレンスコード）とする。

今後、新規作成・リファクタリングを行う際は、この実装パターンに従うこと。

## 基本方針

Type は Mapper の変換前後を明確に定義する。

Mapper は必ず「型A → 型B」の変換のみを担当する。

## Frontend標準型

画面(UI)で扱う標準型を定義する。

例

```ts
DeviceModelType
```

既に多数参照されているため、名称は変更しない。

---

## Backend標準型

Backend(DB)との受け渡しで使用する標準型を定義する。

例

```ts
DeviceModelDBType
```

---

## 操作専用型

Create・Update・Delete ごとに Mapper 前後の型を定義する。

例

```ts
CreateDeviceModelFrontType
CreateDeviceModelBackType

UpdateDeviceModelFrontType
UpdateDeviceModelBackType

DeleteDeviceModelsFrontType
DeleteDeviceModelsBackType
```

FrontType は Frontend が扱う型、

BackType は Backend へ渡す型とする。

型の内容が同一となる場合でも、省略せず両方定義する。

これは Mapper の変換前後を明確にし、将来的な仕様変更に対応しやすくするためである。

---

## Mapper

Mapper は必ず

```text
変換前Type
        ↓
Mapper
        ↓
変換後Type
```

となるよう実装する。

例

```ts
normalizeDeviceModel(
    d: DeviceModelDBType
): DeviceModelType

toCreateDeviceModelRequest(
    deviceModel: CreateDeviceModelFrontType
): CreateDeviceModelBackType

toUpdateDeviceModelRequest(
    deviceModel: UpdateDeviceModelFrontType
): UpdateDeviceModelBackType

toDeleteDeviceModelsRequest(
    deviceModels: DeleteDeviceModelsFrontType
): DeleteDeviceModelsBackType
```

Mapper は型変換のみを責務とし、業務ロジック・API呼び出し・State更新は実装しない。

---

## リファレンス

`deviceModelTypes.ts`

`deviceModelMapper.ts`

を本プロジェクトにおける Type / Mapper の標準実装（Reference Implementation）とする。

今後は、この実装パターンに従って Type・Mapper を作成すること。
