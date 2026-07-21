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
executeWithLoading()
```

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

# Git Ignore Rules

## 目的

不要なキャッシュファイルや機密情報をGitHubへ登録しない。

---

## .gitignore の配置

`.gitignore` はリポジトリルートに配置する。

```
medical-device-board/
├── .gitignore
├── backend/
├── frontend/
└── docs/
```

frontend内やbackend内には配置しない。

---

## 無視するファイル

### Python

```
__pycache__/
*.py[cod]
*.pyo
*.pyd
.venv/
venv/
```

### Next.js

```
frontend/node_modules/
frontend/.next/
frontend/out/
```

### IDE

```
.vscode/
.idea/
```

### OS

```
.DS_Store
Thumbs.db
```

### Environment

```
.env
.env.*
!.env.example
```

---

## 注意事項

.gitignore は「新しくGitへ追加するファイル」のみに有効。

既にGit管理されているファイルは無視されない。

---

## 不要ファイルをGit管理から削除する方法

```
git rm -r --cached .
git add .
git commit -m "Update .gitignore"
```

これによりローカルファイルは残したまま、Git管理のみ解除できる。

---

## 開発ルール

- pycをGitHubへ登録しない
- __pycache__をGitHubへ登録しない
- node_modulesをGitHubへ登録しない
- .nextをGitHubへ登録しない