# Data Model

## Purpose

本ドキュメントは、本プロジェクトで使用するデータモデルを定義する。

本書では

- テーブル設計
- リレーション
- カラム定義
- Snapshot設計
- Dashboard初期データ
- Schema運用方針

を管理する。

API仕様・業務仕様は本書へ記載しない。

---

# Database

本システムは

```
Supabase(PostgreSQL)
```

を利用する。

---

# Multi Tenant Design

全ての業務データは

```
hospital_id
```

によって分離する。

例外

- hospitals
- auth.users

以外は原則としてhospital_idを保持する。

---

# Main Tables

## hospitals

施設情報

主なカラム

```
id

hospital_name

price_plan

is_active

created_at
```

---

## users

アプリケーションユーザー

```
id

hospital_id

email

display_name

role

is_active
```

role

```
system_admin

support

admin

normal

viewer
```

---

## invite_codes

招待管理

```
id

code

hospital_id

email

role

used

expires_at
```

初回管理者登録では

```
hospital_id=NULL
```

を許可する。

---

# Master Tables

## wards

病棟

```
id

hospital_id

name
```

---

## rooms

病室

```
id

hospital_id

ward_id

name

patient_name
```

patient_nameは病室に紐付く。

---

## stock_areas

ストックエリア

```
id

hospital_id

name
```

---

## device_types

機種

```
id

hospital_id

name

icon_color
```

---

## device_models

型式

```
id

hospital_id

device_type_id

name
```

---

## maintenance_types

メンテナンスタイプ

```
id

hospital_id

device_type_id

device_model_id

name

interval_days

warning_days

auto_create_on_drop

is_active
```

---

## infection_types

感染症マスタ

```
id

hospital_id

name

color

display_order
```

---

# Transaction Tables

## devices

機器

```
id

hospital_id

type

model

status

stock_area_id

room_id

asset_type

management_number

serial_number

note

rental_start_date

rental_end_date

is_under_maintenance

maintenance_started_at

maintenance_finished_at

standby

standby_started_at

standby_finished_at

created_by

updated_by

updated_at
```

status

```
stock

room
```

---

## room_infections

病室感染情報

```
id

hospital_id

room_id

infection_type_id
```

複数感染症を保持可能。

---

## device_maintenance_tasks

メンテナンスタスク

```
id

hospital_id

device_id

maintenance_type_id

due_at

completed_at

completed_by

is_active
```

状態

```
Pending

Completed

Cancelled
```

---

## device_maintenance_logs

メンテ実施履歴

```
id

hospital_id

device_id

maintenance_type_id

performed_at

task_id

note
```

---

## device_histories

履歴

```
id

hospital_id

device_id

action_type

message

created_at

action_by

device_type_name

device_model_name

room_name

stock_area_name

patient_name

management_number

serial_number

note
```

---

# Snapshot Rule

HistoryはSnapshotを保持する。

保存対象

```
device_type_name

device_model_name

room_name

stock_area_name

patient_name

management_number

serial_number

note
```

IDから復元しない。

理由

名称変更後も過去履歴を正しく表示するため。

---

# Relation

```
Hospital

├ Users

├ Wards

│   └ Rooms

│        └ RoomInfections

├ StockAreas

├ DeviceTypes

│     └ DeviceModels

│             └ MaintenanceTypes

├ Devices

│     ├ DeviceHistories

│     ├ MaintenanceTasks

│     └ MaintenanceLogs

└ InfectionTypes
```

---

# Dashboard Initial Data

ログイン直後に取得するデータ

```
wards

rooms

stockAreas

deviceTypes

deviceModels

maintenanceTypes

infectionTypes

roomInfections

devices

maintenanceTasks

histories

currentUser
```

可能な限り

```
fetch_init_dashboard
```

のみで取得する。

---

# Schema Rule

Schemaは

API入出力

のみ定義する。

業務ロジックは禁止。

---

# Backend Generated Fields

Frontendから送信しない。

```
hospital_id

created_at

updated_at

created_by

updated_by

status
```

Backendで付与する。

---

# Naming Rule

テーブル

```
snake_case
```

Frontend

```
camelCase
```

Mapperが相互変換する。

---

# History Rule

HistoryはTransactionで生成する。

CRUDは禁止。

---

# Task Rule

Taskはシステムが管理する。

手動作成・手動編集は行わない。

生成

```
Stock → Room

Room(新患者)
```

削除

```
Room → Stock

Device削除
```

再生成

```
Room → Room（新患者）
```

---

# Goal

本ドキュメントのみで

- DB構造
- テーブル責務
- リレーション
- Snapshot設計
- Dashboardデータ構造

を理解できることを目的とする。