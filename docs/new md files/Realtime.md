# Realtime

## Purpose

本ドキュメントは、本システムのRealtime同期仕様を定義する。

BackendはRealtimeを意識せず通常通りTransactionを実行し、
FrontendがRealtime通知を受信してStateを同期する。

---

# Design Philosophy

本システムでは

```
Backend
    ↓
DB更新
    ↓
Supabase Realtime
    ↓
Frontend
    ↓
State更新
```

という構成を採用する。

Backendから特別なRealtimeイベントは送信しない。

---

# Basic Rule

Backend

- CRUD
- Transaction

のみ実行する。

Realtime用コードを書かない。

---

Frontend

Realtime通知を受信し、

更新されたStateのみ更新する。

---

# Realtime Target Tables

同期対象

```
devices

wards

rooms

stock_areas

device_types

device_models

maintenance_types

infection_types

room_infections

device_maintenance_tasks

device_histories
```

---

# State Mapping

devices

↓

deviceList

---

wards

↓

wards

---

rooms

↓

rooms

---

stock_areas

↓

stockAreas

---

device_types

↓

deviceTypes

---

device_models

↓

deviceModels

---

maintenance_types

↓

maintenanceTypes

---

infection_types

↓

infectionTypes

---

room_infections

↓

roomInfections

---

device_maintenance_tasks

↓

maintenanceTasks

---

device_histories

↓

histories

---

# Single Table Update

例

```
Room編集
```

更新

```
rooms
```

Realtime

```
rooms

↓

setRooms()
```

---

# Transaction Update

Transactionは複数Tableを更新する。

例

Stock → Room

更新Table

```
devices

rooms

maintenance_tasks

device_histories
```

Realtimeは4つ受信する。

---

Room → Stock

更新

```
devices

rooms

device_histories

room_infections
```

---

Room → Room（同患者）

更新

```
devices

rooms

device_histories

room_infections
```

---

Room → Room（新患者）

更新

```
devices

rooms

maintenance_tasks

device_histories

room_infections
```

---

Device削除

更新

```
devices

maintenance_tasks

device_histories

rooms

room_infections
```

---

感染症更新

```
room_infections

rooms
```

---

# Frontend Rule

各TableごとにRealtimeファイルを作成する。

例

```
realtime/

fetchDeviceRealtime.ts

fetchRoomRealtime.ts

fetchHistoryRealtime.ts
```

責務は統一する。

```
Realtime受信

↓

API再取得

↓

State更新
```

---

# Synchronization Rule

通知内容を解析しない。

更新Tableのみを見る。

対象Tableを再取得する。

---

# Retry Rule

Realtimeエラー時

自動再接続する。

画面更新は停止しない。

---

# Future Optimization

データ量増加時のみ

```
payload解析

↓

差分更新
```

へ変更を検討する。

現時点では採用しない。

---

# Design Policy

優先順位

```
シンプルさ

＞

通信量削減
```

---

# Goal

Backendを複雑化せず、

FrontendのみでRealtime同期を完結させる。


# Transaction → Updated Tables

## Device

### Create Device

devices
device_histories

---

### Delete Device

devices
device_maintenance_tasks
device_histories
rooms
room_infections

---

### Update Device Info

devices
device_histories

---

### Update Rental Dates

devices
device_histories

---

### Update Management Number

devices
device_histories

---

### Update Serial Number

devices
device_histories

---

### Update Note

devices
device_histories

---

### Start Maintenance

devices
device_histories

---

### Finish Maintenance

devices
device_histories

---

### Start Standby

devices
device_histories

---

### Finish Standby

devices
device_histories

--------------------------------------------------

## Device Movement

### Stock → Room

devices
rooms
device_maintenance_tasks
device_histories

---

### Room → Stock

devices
rooms
device_maintenance_tasks
device_histories
room_infections

---

### Room → Room（Same Patient）

devices
rooms
device_histories
room_infections

---

### Room → Room（New Patient）

devices
rooms
device_maintenance_tasks
device_histories
room_infections

---

### Stock → Stock

devices
device_histories

--------------------------------------------------

## Maintenance Task

### Complete Task

device_maintenance_tasks
device_maintenance_logs
device_histories

---

### Update Due Date

device_maintenance_tasks
device_histories

---

### Cancel Task

device_maintenance_tasks
device_histories

---

### Resume Task

device_maintenance_tasks
device_histories

--------------------------------------------------

## Ward

### Create Ward

wards

---

### Update Ward

wards

---

### Delete Ward

wards
rooms

--------------------------------------------------

## Room

### Create Room

rooms

---

### Update Room

rooms

---

### Update Patient

rooms
device_histories

---

### Delete Room

rooms
devices
room_infections

--------------------------------------------------

## Stock Area

### Create Stock Area

stock_areas

---

### Update Stock Area

stock_areas

---

### Delete Stock Area

stock_areas
devices

--------------------------------------------------

## Device Type

### Create

device_types

---

### Update

device_types

---

### Delete

device_types
device_models
maintenance_types

--------------------------------------------------

## Device Model

### Create

device_models

---

### Update

device_models

---

### Delete

device_models
maintenance_types

--------------------------------------------------

## Maintenance Type

### Create

maintenance_types

---

### Update

maintenance_types

---

### Delete

maintenance_types

--------------------------------------------------

## Infection Type

### Create

infection_types

---

### Update

infection_types

---

### Delete

infection_types
room_infections

--------------------------------------------------

## Room Infection

### Update Room Infections

room_infections
rooms

--------------------------------------------------

## User

### Create User

users

---

### Update User

users

---

### Delete User

users

--------------------------------------------------

## Invite

### Create Invite

invite_codes

---

### Register User

users
invite_codes

---

### First Admin Register

hospitals
users
invite_codes

--------------------------------------------------

## Authentication

### Login

更新なし

---

### Refresh Token

更新なし

--------------------------------------------------

## Export

### History CSV

更新なし

---

### History PDF

更新なし

---

### Device List CSV

更新なし

---

### Device List PDF

更新なし