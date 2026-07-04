# API Specification

## Purpose

本ドキュメントは Frontend と Backend 間の API 契約を定義する。

責務は

- Route一覧
- Request Schema
- Response Schema
- API命名規則
- Dashboard初期取得API
- Transaction API

のみとする。

業務仕様は Business Workflow.md を参照する。

---

# API Design Policy

BackendはRESTを基本とする。

取得

```
GET
```

更新

```
POST
```

で統一する。

---

# Authentication

認証が必要なAPIは

```
Authorization

Bearer {access_token}
```

を送信する。

hospital_idは送信しない。

BackendがcurrentUserから取得する。

---

# Common Rules

Frontendから送信しない項目

```
hospital_id

created_at

updated_at

created_by

updated_by

status
```

Backendで設定する。

---

# Dashboard

## GET /init-dashboard

用途

ログイン直後の初期データ取得

Response

```
DashboardInitialData

├ wards

├ rooms

├ stockAreas

├ deviceTypes

├ deviceModels

├ maintenanceTypes

├ infectionTypes

├ roomInfections

├ devices

├ maintenanceTasks

├ histories

└ currentUser
```

Dashboard表示では可能な限りこのAPIのみ利用する。

---

# Ward API

## GET /wards

Response

```
WardResponse[]
```

---

## POST /wards

Request

```
AddWardRequest
```

Response

```
WardResponse
```

---

## POST /update-ward

Request

```
UpdateWardRequest
```

---

## POST /delete-ward

Request

```
DeleteWardRequest
```

---

# Room API

## GET /rooms

```
RoomResponse[]
```

---

## POST /rooms

```
AddRoomRequest
```

---

## POST /update-room

```
UpdateRoomRequest
```

---

## POST /update-room-patient

```
UpdateRoomPatientRequest
```

---

## POST /delete-rooms

```
DeleteRoomsRequest
```

---

# Stock Area API

## GET /stock-areas

```
StockAreaResponse[]
```

---

## POST /stock-areas

```
AddStockAreaRequest
```

---

## POST /update-stock-area

```
UpdateStockAreaRequest
```

---

## POST /delete-stock-areas

```
DeleteStockAreasRequest
```

---

# Device Type API

## GET /device-types

```
DeviceTypeResponse[]
```

---

## POST /device-types

```
AddDeviceTypeRequest
```

---

## POST /update-device-type

```
UpdateDeviceTypeRequest
```

---

## POST /delete-device-types

```
DeleteDeviceTypeRequest
```

---

# Device Model API

## GET /device-models

```
DeviceModelResponse[]
```

---

## POST /device-models

```
AddDeviceModelRequest
```

---

## POST /update-device-model

```
UpdateDeviceModelRequest
```

---

## POST /delete-device-models

```
DeleteDeviceModelsRequest
```

---

# Maintenance Type API

## GET /maintenance-types

```
MaintenanceTypeResponse[]
```

---

## POST /maintenance-types

```
AddMaintenanceTypeRequest
```

---

## POST /update-maintenance-type

```
UpdateMaintenanceTypeRequest
```

---

## POST /delete-maintenance-types

```
DeleteMaintenanceTypesRequest
```

---

# Infection API

## GET /infection-types

```
InfectionTypeResponse[]
```

---

## POST /infection-types

```
AddInfectionTypeRequest
```

---

## POST /update-infection-type

```
UpdateInfectionTypeRequest
```

---

## POST /delete-infection-types

```
DeleteInfectionTypesRequest
```

---

# Room Infection API

## GET /room-infections

```
RoomInfectionResponse[]
```

---

## POST /update-room-infections

```
UpdateRoomInfectionsRequest
```

病室単位で感染症を一括更新する。

---

# Device API

## GET /devices

```
DeviceResponse[]
```

---

## POST /devices

```
AddDeviceRequest
```

---

## POST /delete-device

```
DeleteDevicesRequest
```

---

## POST /update-device-info

```
UpdateDeviceInfoRequest
```

---

## POST /update-rental-dates

```
UpdateRentalDatesRequest
```

---

## POST /start-maintenance

```
StartMaintenanceRequest
```

---

## POST /finish-maintenance

```
FinishMaintenanceRequest
```

---

## POST /start-standby

```
StartStandbyRequest
```

---

## POST /finish-standby

```
FinishStandbyRequest
```

---

# Device Transaction API

## POST /move-stock-to-room

Stock → Room

---

## POST /move-room-to-stock

Room → Stock

---

## POST /move-room-to-room

同患者

---

## POST /move-room-to-room-new-patient

別患者

---

## POST /move-stock-to-stock

Stock → Stock

---

# Maintenance Task API

## GET /maintenance-tasks

```
MaintenanceTaskResponse[]
```

---

## POST /complete-maintenance-task

Task実施

---

## POST /update-maintenance-task-due-at

期限変更

---

## POST /cancel-maintenance-task

中止・中止解除

---

# History API

## GET /histories

```
HistoryResponse[]
```

---

# Export API

## POST /export-history-pdf

履歴PDF

---

## POST /export-history-csv

履歴CSV

---

## POST /export-device-list-pdf

機器一覧PDF

---

## POST /export-device-list-csv

機器一覧CSV

---

# Authentication API

## POST /login

ログイン

---

## POST /refresh-token

Token更新

---

## GET /current-user

ログインユーザー取得

---

## POST /invite-user

ユーザー招待

---

## POST /invite-first-admin

初回管理者招待

---

## POST /register

一般登録

---

## POST /register-first-admin

初回管理者登録

---

# Response Rule

Backendはsuccess wrapperを返さない。

OK

```
[
    ...
]
```

または

```
{
    ...
}
```

のみ返却する。

---

# Error Rule

```
200 OK

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

500 Internal Server Error
```

---

# Goal

本ドキュメントのみで

- 全API
- Request
- Response
- 命名規則
- Dashboard取得
- Transaction API

を把握できる状態を維持する。