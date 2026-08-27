# Schema / Type / Mapper 設計ルール

## 1. 基本方針

本プロジェクトでは、Schema / Type / Mapper の役割を明確に分離する。

基本的な考え方は以下の通り。

```text
Frontend UI
    ↓
Frontend Type
    ↓
Mapper
    ↓
Backend Type
    ↓
Backend Schema
    ↓
Route / Transaction / CRUD
    ↓
DB
```

ただし、Schemaの構造は単純にDBテーブル構造から決めるのではなく、**UIとAPIの構造を基準に決める**。

特に、一括更新型と即時更新型では必要なデータ量が異なるため、UIの構造によってSchemaの持つ変数も変わる。

> Schemaの規則を統一することだけを目的にするのではなく、まずUI / APIの構造を明確にする。

---

# 2. Backend Schema

## 2-1. Schemaの役割

Schemaは、

> **API（Request / Response）で受け渡しするデータ構造を定義するもの**

である。

DBテーブルそのものの定義ではない。

```text
JSON
 ↓
Pydantic Object
```

を担当する。

DBへの具体的な変換や複数Tableにまたがる処理は、Mapper / CRUD / Transactionが担当する。

---

## 2-2. RequestはAPI単位で作成する

Request Schemaは、**そのAPIが必要とする変数だけ**を定義する。

例：

```python
class UpdateNoteRequest(BaseModel):
    id: int
    note: str | None = None
```

一方、複数の処理を何でも詰め込んだSchemaは避ける。

```text
× DeviceRequest
    id
    management_number
    serial_number
    note
    ...
```

---

## 2-3. CRUD単位ではなくAPI単位

例えば、

```text
POST /move-device
```

なら、

```python
MoveDeviceRequest
```

を作る。

```text
POST /update-note
```

なら、

```python
UpdateNoteRequest
```

を作る。

CRUDという実装単位ではなく、**APIの契約単位**でSchemaを考える。

---

## 2-4. 一つのSchemaに何でも詰め込まない

例えばDeviceに対して、

```text
× UpdateDeviceRequest
    id
    status
    room_id
    stock_area_id
    note
    management_number
    serial_number
    ...
```

とするのではなく、

```text
○ MoveDeviceRequest
○ UpdateNoteRequest
○ UpdateManagementNumberRequest
○ UpdateSerialNumberRequest
```

のように、APIごとに必要なデータを定義する。

---

## 2-5. Response

Responseは、

> **画面へ返したいデータ**

を定義する。

DBそのままである必要はない。

JOINした値や画面表示用に組み合わせた値でもよい。

例：

```python
class UserManagementResponse(BaseModel):
    hospital_name: str
    display_name: str
    role: str
```

---

## 2-6. DBに存在しない項目も定義できる

SchemaはDB定義ではなくAPI契約なので、API処理に必要であればDBに存在しない項目も定義してよい。

例：

```text
quantity
code
password
display_name
```

---

## 2-7. Backendが決定する値はRequestに含めない

Backendで決定する値は、原則としてRequestに含めない。

例：

```text
hospital_id
created_at
updated_at
created_by
updated_by
```

これらはBackend側で設定する。

---

## 2-8. DB Column名を基本とする

Backend Schemaの変数名は、可能な限りDB Column名に合わせる。

例：

```text
hospital_id
display_name
is_active
```

Frontendも同じ命名規則を使用できる場合は、同じ名前を使用してMapperを減らしてよい。

---

# 3. Frontend Type

## 3-1. Front / Back Typeを分ける

FrontendでcamelCaseを使用し、Backend APIではsnake_caseを使用する場合、Front TypeとBack Typeを分離する。

例：

```ts
export type CreateInspectionChecklistFrontType = {
    inspectionTypeId: number
    deviceTypeId: number
    deviceModelId?: number | null
    name: string
    version?: number
}

export type CreateInspectionChecklistBackType = {
    inspection_type_id: number
    device_type_id: number
    device_model_id: number | null
    name: string
    version: number
}
```

ただし、FrontendとBackendで同じ命名を使用できる場合は、無理にFront / Back Typeを分ける必要はない。

---

## 3-2. Table用Type

Frontend TypeはAPIや画面で必要なデータ構造に合わせて定義する。

例：

```text
InspectionChecklist
InspectionChecklistDB

CreateInspectionChecklistFrontType
CreateInspectionChecklistBackType

UpdateInspectionChecklistFrontType
UpdateInspectionChecklistBackType
```

---

# 4. Mapper

## 4-1. Mapperの役割

Mapperは、Front TypeとBack Typeのデータ変換を担当する。

```text
Frontend Type
camelCase
    ↓
Mapper
    ↓
Backend Type
snake_case
```

MapperはSchemaの役割ではない。

---

## 4-2. Mapperを使用する場合

例えば、

```ts
toCreateInspectionChecklistRequest(
    front: CreateInspectionChecklistFrontType
): CreateInspectionChecklistBackType
```

のようにする。

Frontendの画面StateとBackend APIのデータ構造が異なる場合にMapperを使用する。

---

## 4-3. Mapperを無理に作らない

FrontendとBackendで同じ構造・同じ命名を使用できる場合は、Mapperを省略してよい。

目的はMapperの数を増やすことではなく、**FrontとBackの責務を明確にすること**である。

---

# 5. Transaction

## 5-1. Transactionの役割

Transactionは、**複数の処理・複数Tableにまたがる一連の処理をまとめる**。

例：

```text
点検表作成
    ↓
inspection_checklists INSERT
    ↓
checklist_id取得
    ↓
inspection_checklist_items INSERT
```

---

## 5-2. Transaction専用Schema

複数TableにまたがるAPIでは、Transaction専用Schemaを作ってよい。

例：

```text
schemas/
└── inspection_schemas/
    ├── inspection_checklist_schemas.py
    ├── inspection_checklist_item_schemas.py
    └── transaction_shemas/
        └── inspection_checklist_transaction_schemas.py
```

Transaction Schemaは、**そのTransaction APIが受け取るデータ構造**を定義する。

---

## 5-3. 複数Body引数を避ける

複数Tableのデータを1回のAPIで送る場合、

```python
def create_inspection_checklist(
    inspection_checklist: AddInspectionChecklistRequest,
    items: list[AddInspectionChecklistItemRequest],
):
```

のように複数のBody引数を直接定義すると、Frontendが送りたいJSON構造とFastAPIが期待するBody構造がずれる場合がある。

そのため、Transactionでは原則として1つのRequestとして受ける。

今回の点検表作成では、

```python
def create_inspection_checklist(
    request: list[CreateInspectionChecklistTransactionRequest],
):
```

とする。

---

## 5-4. Transaction SchemaをCRUDへそのまま渡さない

Transaction Schemaは複数Table分のデータを含む可能性がある。

そのため、TransactionからCRUDへは、対象Table用のSchemaへ分解して渡す。

```text
CreateInspectionChecklistTransactionRequest
        ↓
AddInspectionChecklistRequest
        ↓
add_inspection_checklist()

CreateInspectionChecklistTransactionRequest
        ↓
AddInspectionChecklistItemRequest
        ↓
add_inspection_checklist_item()
```

CRUDには、そのCRUDが必要とするSchemaだけを渡す。

---

## 5-5. Transactionで生成された値を次のCRUDへ渡す

例えばChecklistをINSERTして生成された `checklist_id` は、Transactionが受け取り、Item CRUDへ独立した引数として渡す。

```python
checklist = add_inspection_checklist(
    client,
    inspection_checklist,
    hospital_id,
)

checklist_id = checklist["id"]

for item in items:
    add_inspection_checklist_item(
        client,
        item,
        checklist_id,
    )
```

`checklist_id` のように処理途中で生成される値を、FrontendのCreate Requestに持たせない。

---

# 6. Transaction Front / Back Type

Transactionについても、Front / Backを分けることができる。

```text
CreateXXXTransactionFrontType
        ↓
Mapper
        ↓
CreateXXXTransactionBackType
```

例：

```ts
export type CreateInspectionChecklistTransactionFrontType = {
    inspectionTypeId: number
    deviceTypeId: number
    deviceModelId?: number | null
    name: string
    version?: number

    displayOrder: number
    itemName: string
    itemTypeId: number
    required: boolean
    defaultValue?: string | null
    options?: string[] | null
    unit?: string | null
}
```

```ts
export type CreateInspectionChecklistTransactionBackType = {
    inspection_type_id: number
    device_type_id: number
    device_model_id: number | null
    name: string
    version: number

    display_order: number
    item_name: string
    item_type_id: number
    required: boolean
    default_value: string | null
    options: string[] | null
    unit: string | null
}
```

---

# 7. `&` によるType合成

Transaction Typeを、

```ts
export type CreateInspectionChecklistTransactionRequest =
    AddInspectionChecklist &
    AddInspectionChecklistItem
```

のように既存TypeのIntersectionで作ることは、原則として避ける。

理由は、既存のCRUD用Frontend TypeがcamelCaseの場合、Transaction TypeもcamelCaseのプロパティを要求するためである。

Mapperがsnake_caseのBack Typeを返す場合、Typeが一致しなくなる。

Transaction用のFront / Back Typeを独立して定義する。

---

# 8. Frontend Transaction

Frontend Transactionは、Mapperで生成されたBack TypeをBackendへ送信する。

```ts
type CreateInspectionChecklistTransactionParams = {
    requests: CreateInspectionChecklistTransactionBackType[]
}
```

送信時は、

```ts
body: JSON.stringify(params.requests)
```

とする。

Frontend Transaction自身ではcamelCase → snake_caseの変換を行わない。

変換はMapperの責務とする。

---

# 9. API専用Schemaを作る

特定のAPI専用Schemaを作ることをためらわない。

例：

```text
VerifyAccountEditCodeRequest
MoveDeviceRequest
ExportHistoryPdfRequest
CreateInspectionChecklistTransactionRequest
```

重要なのは、**そのAPIを呼び出すために必要なデータを明確にすること**。

---

# 10. 1ファイル = 1テーブルの原則について

テーブル単位でSchemaを管理することを基本とする。

例：

```text
device_schemas.py
hospital_schemas.py
user_schemas.py
room_schemas.py
```

ただし、Transactionのように複数Tableを扱うAPI専用Schemaについては、Transaction用フォルダに分けて管理してよい。

これは「1ファイル = 1テーブル」という原則の例外ではなく、**API専用Schemaという目的に基づく整理**とする。

---

# 11. 命名規則

## Frontend Type

```text
CreateXXXFrontType
CreateXXXBackType

UpdateXXXFrontType
UpdateXXXBackType

DeleteXXXFrontType
DeleteXXXBackType

CreateXXXTransactionFrontType
CreateXXXTransactionBackType
```

## Backend Schema

```text
AddXXXRequest
UpdateXXXRequest
DeleteXXXRequest

CreateXXXTransactionRequest
UpdateXXXTransactionRequest
```

既存プロジェクトの命名規則との整合性を優先する。

---

# 12. 設計判断の優先順位

Schema / Type / Mapperの設計で迷った場合は、以下の順で判断する。

```text
1. UIの構造
      ↓
2. APIの構造
      ↓
3. Front / Backのデータ構造
      ↓
4. Schema / Type
      ↓
5. Mapperの必要性
      ↓
6. CRUD / Transaction
```

特に重要なのは、

> **SchemaはDBの定義ではなく、APIの契約書である。**

という考え方である。

DBに存在する項目でもAPIで使わないなら定義しない。

DBに存在しなくてもAPIで必要なら定義してよい。

そして、複数Tableにまたがる処理では、

```text
Frontend
    ↓
Transaction Front Type
    ↓
Mapper
    ↓
Transaction Back Type
    ↓
Backend Transaction Schema
    ↓
Backend Transaction
    ↓
Table単位のSchema
    ↓
CRUD
    ↓
DB
```

という流れを基本とする。
