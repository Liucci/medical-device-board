Schema設計ルール

schemasの構造はUIの構造による。
一括更新型では一つのschemaが持つ変数が多くなる
即時更新ではschema持つ変数は最小になる
故に、UIの構造によってschemaの構造が決まる。
Schemaの規則の統一化よりもUI構造のルールを決めることが重要。
上記を踏まえて下記にschemaの規則を記述する。


1. Schemaの役割

Schemaは

API(Request/Response)で受け渡しするデータ構造を定義する。

DBテーブルの定義ではない。

2. RequestはAPI単位で作成する

Requestは

そのAPIが必要とする変数だけ

定義する。

例

class UpdateNoteRequest(BaseModel):
    id: int
    note: str | None = None

×

class DeviceRequest(BaseModel):
    id
    management_number
    serial_number
    note
    ...
3. ResponseはAPIが返すデータを定義する

Responseは

画面へ返したいデータ

を定義する。

DBそのままである必要はない。

JOINした値でもよい。

例

class UserManagementResponse(BaseModel):
    hospital_name: str
    display_name: str
    role: str
4. DBに存在しない項目でも定義してよい

SchemaはDBではなくAPIの契約なので、

例えば

quantity
code
password
display_name

など、

API処理に必要なら定義する。

5. Backendが決定する値はRequestに含めない

例えば

hospital_id
created_at
updated_at
created_by
updated_by

など。

これらはBackendが設定する。

6. DB Column名を基本とする

Request・Responseの変数名は

可能な限りDB Column名に合わせる。

例

hospital_id

display_name

is_active

Frontendも同じ名前を送る。

Mapperを減らせる。

7. CRUD単位ではなくAPI単位

例えば

POST /move-device

なら

MoveDeviceRequest
POST /update-note

なら

UpdateNoteRequest

を作る。

8. 一つのSchemaに何でも詰め込まない

×

UpdateDeviceRequest
id
status
room_id
stock_area_id
note
management_number
serial_number
...

○

MoveDeviceRequest

UpdateNoteRequest

UpdateManagementNumberRequest

UpdateSerialNumberRequest
9. Responseは用途別でよい

例えばUserなら

UserResponse

FetchCurrentUserResponse

UserManagementResponse

など、

画面ごとに必要なら分けてよい。

10. SchemaはMapperではない

Schemaは

JSON
↓

Python Object

を行うだけ。

DB変換は

Mapper

CRUD

Transaction

で行う。

このルールの最大の考え方

Schemaは

「DBの定義」ではなく、「APIの契約書」である。

つまり、

DBに存在する項目でもAPIで使わないなら定義しない。
DBに存在しなくてもAPIで必要なら定義する。

「このAPIを呼び出すには、どのデータが必要で、どのデータが返ってくるか」を明確にすることがSchemaの役割です。

あなたのプロジェクト用に追加したいルール

このプロジェクトでは、さらに次の2つを追加すると運用しやすくなります。

11. 1ファイル = 1テーブルを基本とする
device_schemas.py
hospital_schemas.py
user_schemas.py
room_schemas.py

テーブル単位で管理し、そのテーブルに関するRequest・Responseをまとめる。

12. API専用のSchemaは遠慮なく作る

例えば

VerifyAccountEditCodeRequest
MoveDeviceRequest
ExportHistoryPdfRequest

のように、特定のAPI専用のSchemaを作ることをためらわないことです。