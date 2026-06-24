# Dashboard Initial Data

## Purpose

ログイン直後に取得する初期データ構造を定義する。

fetch_init_dashboard.py の返却値を管理する。

---

# DashboardInitialData

```text
DashboardInitialData
├ wards
├ rooms
├ stockAreas
├ deviceTypes
├ deviceModels
├ maintenanceTypes
├ devices
├ histories
├ tasks
└ currentUser
```

---

# wards

```text
WardResponse[]
```

---

# rooms

```text
RoomResponse[]
```

---

# stockAreas

```text
StockAreaResponse[]
```

---

# deviceTypes

```text
DeviceTypesResponse[]
```

---

# deviceModels

```text
DeviceModelsResponse[]
```

---

# maintenanceTypes

```text
MaintenanceTypeResponse[]
```

---

# devices

```text
DeviceResponse[]
```

---

# histories

```text
HistoryResponse[]
```

---

# tasks

```text
MaintenanceTaskResponse[]
```

---

# currentUser

```text
UserResponse
```

---

# Design Rule

ログイン後は可能な限り

```text
fetch_init_dashboard
```

のみで初期表示に必要なデータを取得する。

個別APIは更新時のみ利用する。

---

# Responsibility

fetch_init_dashboard.py

```text
初期画面に必要な全データ取得
```

Frontend

```text
DashboardInitialData
↓
normalize
↓
state格納
```


isDraggingRefを使用する

startDrag
↓
isDraggingRef.current = true

handleMouseUp
↓
setTimeout(() => {
  isDraggingRef.current = false
},0)

RoomContainer
Stock

onMouseUp

if (isDraggingRef.current) return