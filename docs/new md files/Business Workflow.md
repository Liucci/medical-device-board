# Business Workflow

## Purpose

本ドキュメントは、本アプリケーションの業務仕様を定義する。

Architecture が「どのように作るか」を定義するのに対し、

Business Workflow は

「何を実現するか」

を定義する。

---

# System Overview

本システムは

**医療機器の配置・運用・保守・履歴・感染症情報**

を一元管理することを目的とする。

対象

- 病棟
- 病室
- ストック
- 医療機器
- 患者
- メンテナンス
- 感染症
- 履歴

---

# User Management

## 初回管理者

運営(system_admin)が招待する。

登録後

Hospital

↓

Admin

↓

Dashboard

---

## 一般ユーザー

Adminが招待する。

招待コード経由で登録する。

---

# Dashboard

構成

```
病棟エリア

ストックエリア

ボタンパネル
```

特徴

- Grid管理
- ドラッグ操作
- ズーム
- スクロール
- DragLayer使用

---

# Device Registration

新規登録

↓

CE室へ配置

↓

Taskは作成しない

---

# Device Display

表示項目

- 機種
- 型式
- 管理番号
- シリアル番号
- レンタル
- 代替機
- スタンバイ
- 保守状態

---

# Room

病室は最大6台まで表示する。

病室から最後の機器が無くなった場合

```
patient_name

room_infections
```

をリセットする。

---

# Stock Area

機器保管場所。

病室情報は保持しない。

---

# Device Movement

## Stock → Room

実施内容

- room設定
- stock解除
- History作成
- Task生成

---

## Room → Stock

実施内容

- room解除
- patient削除
- Task削除
- 感染症解除
- History作成

---

## Stock → Stock

実施内容

配置変更のみ。

---

## Room → Room（同患者）

維持する

- 管理番号
- シリアル
- 備考
- Task

History作成。

---

## Room → Room（新患者）

リセット

- 管理番号
- シリアル
- 備考

Task

```
削除

↓

再生成
```

History作成。

---

# Patient Rule

patient_nameは

**病室**

に所属する。

患者が病室を移動した場合

移動元patient_nameを削除する。

---

# Infection Management

感染症は

```
room
```

に所属する。

複数登録可能。

---

## Infection Type

管理項目

- 名称
- 色
- 表示順

---

## Room Infection

複数選択可能。

RoomContainerへアイコン表示。

RoomDeviceInfoModalから編集する。

---

# Maintenance

## Maintenance Type

保持

- interval_days
- warning_days
- auto_create_on_drop

---

## Task生成

生成タイミング

```
Stock → Room

Room→Room（新患者）
```

---

## Task削除

```
Room → Stock

Device削除
```

---

## Task実施

記録

```
completed_at

completed_by
```

History作成。

---

## Task期限変更

due_at更新。

History作成。

---

## Task中止

```
is_active=false
```

History作成。

---

## Task中止解除

```
is_active=true
```

History作成。

---

# Device History

Historyは

Snapshot

として保存する。

保存対象

```
機種名

型式名

病室名

ストック名

患者名

管理番号

シリアル

備考
```

名称変更後も当時の履歴を保持する。

---

# Action Type

```
device_created

device_deleted

moved_to_room

moved_to_stock

management_number_updated

serial_number_updated

note_updated

patient_name_updated

maintenance_started

maintenance_finished

maintenance_task_completed

standby_started

standby_finished
```

---

# Device Information

Stock

編集可能

- 管理番号
- シリアル
- 備考
- 保守
- レンタル

Room

追加

- 患者名
- 感染症
- Standby

---

# Low Stock

型式ごとの残数を表示する。

2台未満

↓

赤表示

---

# Export

History

- CSV
- PDF

Device List

- CSV
- PDF

---

# Realtime

Realtimeは

更新されたTableごと

に同期する。

---

## Device

devices更新

↓

deviceList更新

---

## Room

rooms更新

↓

rooms更新

---

## Stock

stock_areas更新

↓

stockAreas更新

---

## History

histories更新

↓

history更新

---

## Task

tasks更新

↓

maintenanceTasks更新

---

## Infection

infection_types

↓

infectionTypes

room_infections

↓

roomInfections

---

## Transaction

Transactionは

更新された全Table

をRealtime同期する。

例

Room→Stock

↓

devices

rooms

histories

room_infections

---

# Last Updated

病棟

ストック

それぞれ

```
updated_at

updated_by
```

から最終更新日時を表示する。

Move系Transaction完了後に更新する。

---

# UI Rules

Drag中はModalを開かない。

Loading中は画面全体を操作不可とする。

更新系はexecuteWithLoadingを利用する。

---

# Goal

本ドキュメントのみで

- アプリ全体の業務フロー
- 状態遷移
- Task運用
- 感染症運用
- History運用
- Realtime運用

を理解できる状態を維持する。



# Last Updated Rule

## Purpose

本ドキュメントは、Dashboardで表示する各エリアの最終更新日時の仕様を定義する。

---

## Basic Rule

最終更新日時は `devices.updated_at` を利用する。

---

## Initial Load

Dashboard初回表示時は

* `fetchStockLastUpdated()`
* `fetchWardLastUpdated()`

を実行し、現在存在するDeviceの `updated_at` の最新日時を取得して表示する。

---

## Realtime

Realtime受信時は `payload.old.status` と `payload.new.status` を利用して更新対象を判定する。

* Room → Room

  * Wardのみ更新
* Stock → Stock

  * Stockのみ更新
* Room → Stock

  * Ward・Stock両方更新
* Stock → Room

  * Ward・Stock両方更新

通常運用時はRealtimeにより各エリアの最終更新日時を維持する。

---

## Refresh

本システムはRealtime運用を前提とする。

リロード時は `fetchStockLastUpdated()` および `fetchWardLastUpdated()` を実行し、現在存在するDeviceの `updated_at` を基に最新日時を取得する。

そのため、Room → Stock、Stock → Room 実施後にリロードした場合、移動元エリアの最終更新日時は現在そのエリアに存在するDeviceの最新日時となる。

これは現仕様とし、リロード後に移動イベント自体の最終更新日時は保持しない。

---

## Design Policy

最終更新日時は画面表示用情報とする。

永続的な管理は行わず、通常利用時はRealtimeにより最新状態を維持することを前提とする。
