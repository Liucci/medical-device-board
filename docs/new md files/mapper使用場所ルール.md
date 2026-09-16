# Frontend Mapper / CRUD / Transaction リファクタリング方針

## 目的

現在のFrontendでは、mapperを使用する場所がfetch系・transaction系で統一されておらず、page.tsx側でnormalizeするケースとtransaction内でnormalizeするケースが混在している。

将来的なリファクタリングでは、mapperの責務と使用場所を整理し、以下の構造へ少しずつ移行する。

> **page.tsxはUI状態管理、TransactionはUI/API境界と処理フロー、CRUDはAPIアクセスに集中させる。**

一度に全面変更するのではなく、既存機能の修正・追加時などに少しずつこの形へ寄せていく。

---

## 1. 基本構造

```text
page.tsx
    ↓
Transaction
    ↓
CRUD
    ↓
API
    ↓
DB
```

データ変換を含めると、

```text
UI
 ↓
Transaction
 ↓
UI → API変換（mapper）
 ↓
CRUD
 ↓
API
 ↓
DB
```

取得時は、

```text
DB
 ↓
API
 ↓
CRUD
 ↓
Transaction
 ↓
API → UI変換（normalize / mapper）
 ↓
UI
```

---

## 2. CRUDの責務

FrontendのCRUD系関数は、原則として**APIへのアクセスだけ**を担当する。

### CRUDが担当するもの

- APIへのfetch
- HTTP methodの指定
- headers
- credentials
- request bodyの送信
- API responseの受け取り
- 必要最小限のHTTPエラー処理

### CRUDが原則として担当しないもの

- UI → API形式への変換
- API → UI形式への変換
- normalize
- Transaction固有の処理フロー
- 複数CRUDを組み合わせた処理

イメージ：

```text
addDeviceType()
    ↓
POST /device-types

updateDeviceType()
    ↓
PUT /device-types/{id}

fetchDeviceTypes()
    ↓
GET /device-types
```

CRUDは「どうAPIへアクセスするか」に集中する。

---

## 3. Transactionの責務

Transactionは**UIとAPIの境界**および**処理フロー**を担当する。

### Transactionが担当するもの

- UIデータをAPI request形式へ変換
- 必要なCRUDを呼び出す
- 複数CRUDを組み合わせる処理
- Transaction後に必要な最新データをfetchする
- APIから取得したデータをUI形式へ変換
- page.tsxへUI形式のデータを返す

例えば登録Transaction：

```text
DeviceType（UI）
      ↓
toCreateDeviceTypeRequest()
      ↓
AddDeviceTypeRequest
      ↓
addDeviceType()
      ↓
API
```

登録後の状態取得：

```text
POST
 ↓
登録完了
 ↓
fetchDeviceTypes()
 ↓
normalizeDeviceType()
 ↓
DeviceType（UI）
```

---

## 4. Mapperの使用場所

将来的には、mapperを**Transactionの境界で使用する**方針とする。

### UI → API

Transaction専用のrequest mapperを使用する。

```ts
toCreateDeviceTypeRequest(deviceType)
```

```text
DeviceType（UI）
      ↓
toCreateDeviceTypeRequest()
      ↓
AddDeviceTypeRequest（API）
```

### API → UI

normalize mapperを使用する。

```ts
normalizeDeviceType(deviceType)
```

```text
DeviceTypeResponse / DB形式
      ↓
normalizeDeviceType()
      ↓
DeviceType（UI）
```

---

## 5. page.tsxからmapperを減らす

現在、初期fetchなどでpage.tsx内に以下のような処理が存在する場合がある。

```ts
const deviceTypes = await getDeviceTypesFromApi()

setDeviceTypes(
    deviceTypes.map(
        normalizeDeviceType
    )
)
```

将来的には、このようなmapper処理をTransaction側へ移す。

```ts
const deviceTypes =
    await fetchDeviceTypesTransaction()

setDeviceTypes(deviceTypes)
```

つまり、page.tsxでは原則としてmapperを直接呼ばない。

### page.tsxの理想形

```ts
const data = await xxxTransaction()

setData(data)
```

page.tsxは、

- データ取得の呼び出し
- stateへのセット
- UIイベント
- UI表示

など、UI側の責務に集中する。

---

## 6. Transaction専用Type

TransactionごとにAPIへ渡すデータ構造が異なる場合は、専用のTypeを定義する。

例えば、

```text
UI Type
    ↓
Transaction Mapper
    ↓
Transaction Request Type
    ↓
CRUD
```

ただし、すべてのTransactionに専用Typeを無条件で作るわけではない。

既存のUI TypeやAPI Request Typeで十分表現できる場合は、それらを利用する。

### 判断基準

- Transaction固有のrequest構造がある → 専用Typeを検討
- 既存Request Typeで表現できる → 新しいTypeは作らない
- UI TypeとAPI Request Typeが異なる → mapperを用意する

---

## 7. Responseの扱い

Transactionでは、原則としてadd系CRUD・update系CRUDが返すresponseをそのままUI更新には使用しない。

基本方針は、

```text
add / update
    ↓
処理完了
    ↓
fetch
    ↓
最新の全columnを取得
    ↓
normalize
    ↓
UIへ返す
```

とする。

### 理由

登録・更新直後に、対象データだけでなく関連する最新状態を取得できるため。

また、

> **「Transaction完了後はfetchして最新のUIデータを返す」**

という統一ルールにしやすい。

---

## 8. 例：DeviceType追加

### CRUD

```ts
addDeviceType(request)
```

CRUDはrequestを受け取りAPIへ送るだけ。

### Transaction

```ts
export const addDeviceTypeTransaction = async (
    deviceType: DeviceType
) => {

    // UI → API
    await addDeviceType(
        toCreateDeviceTypeRequest(deviceType)
    )

    // 最新データを取得
    const deviceTypes =
        await fetchDeviceTypes()

    // API → UI
    return deviceTypes.map(
        normalizeDeviceType
    )
}
```

### page.tsx

```ts
const deviceTypes =
    await addDeviceTypeTransaction(deviceType)

setDeviceTypes(deviceTypes)
```

page.tsxにはmapperを記述しない。

---

## 9. 将来的な責務分担

| 層 | 主な責務 |
|---|---|
| page.tsx | UI・state管理・イベント処理 |
| Transaction | 処理フロー・UI/API境界・mapper |
| CRUD | APIアクセス |
| API | HTTP endpoint |
| Backend Route | request/responseの受付 |
| Backend Schema | APIデータ構造 |
| Backend CRUD | DB操作 |
| Backend Transaction | 複数DB操作・transaction処理 |
| DB | 永続化 |

---

## 10. リファクタリング時の原則

この方針は**一括リファクタリングしない**。

既存機能を壊すリスクを避けるため、以下のように段階的に移行する。

### 優先順位

1. 新規Transactionを作る際は、このルールに従う
2. 修正する既存Transactionがあれば、そのタイミングでmapperをTransaction側へ寄せる
3. page.tsxにmapper処理が残っている箇所を、機能修正時に少しずつ移動する
4. CRUDにmapper処理が残っている場合は、必要に応じてTransaction側へ移動する
5. 最終的にpage.tsx → Transaction → CRUDという責務分担を目指す

---

## 11. 最終的な目標

Frontendの基本的なデータフローを、

```text
                    ┌──────────────┐
                    │   page.tsx   │
                    │              │
                    │ UI / State   │
                    └──────┬───────┘
                           │
                           ↓
                    ┌──────────────┐
                    │ Transaction  │
                    │              │
                    │ UI ↔ API     │
                    │ mapper       │
                    │ 処理フロー   │
                    └──────┬───────┘
                           │
                           ↓
                    ┌──────────────┐
                    │     CRUD     │
                    │              │
                    │ APIアクセス  │
                    └──────┬───────┘
                           │
                           ↓
                          API
                           │
                           ↓
                          DB
```

とする。

### 一言でまとめると

> **CRUDはアクセス、Transactionは変換と処理フロー、page.tsxはUI。**

この原則を将来のFrontendリファクタリング時の基準とする。
