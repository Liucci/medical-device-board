# Schema Mapping Rules

## Purpose

Frontend Type と Backend Schema の対応関係を定義する。

新規機能追加時は本ドキュメントを更新する。

---

# 基本ルール

## Response

```text
Response Schema
↓
normalizeXxx
↓
Frontend Type
```

例

```text
WardResponse
↓
normalizeWard
↓
Ward
```

```text
DeviceResponse
↓
normalizeDevice
↓
Device
```

---

## Create

```text
Frontend Type
↓
toAddXxxRequest
↓
AddXxxRequest
```

例

```text
DeviceType
↓
toAddDeviceTypeRequest
↓
AddDeviceTypeRequest
```

---

## Update

```text
Frontend Type
↓
toUpdateXxxRequest
↓
UpdateXxxRequest
```

例

```text
MaintenanceType
↓
toUpdateMaintenanceTypeRequest
↓
UpdateMaintenanceTypeRequest
```

---

## Delete

```text
Frontend Type
または
ID配列
↓
toDeleteXxxRequest
↓
DeleteXxxRequest
```

---

# Ward

## Response

```text
WardResponse
↓
normalizeWard
↓
Ward
```

## Create

```text
Ward
↓
toAddWardRequest
↓
AddWardRequest
```

## Update

```text
Ward
↓
toUpdateWardRequest
↓
UpdateWardRequest
```

## Delete

```text
number[]
↓
toDeleteWardRequest
↓
DeleteWardRequest
```

---

# DeviceType

## Response

```text
DeviceTypesResponse
↓
normalizeDeviceType
↓
DeviceType
```

---

# DeviceModel

## Response

```text
DeviceModelsResponse
↓
normalizeDeviceModel
↓
DeviceModel
```

---

# Room

## Response

```text
RoomResponse
↓
normalizeRoom
↓
Room
```

---

# StockArea

## Response

```text
StockAreaResponse
↓
normalizeStockArea
↓
StockArea
```

---

# MaintenanceType

## Response

```text
MaintenanceTypeResponse
↓
normalizeMaintenanceType
↓
MaintenanceType
```

## Create

```text
MaintenanceType
↓
toCreateMaintenanceTypeRequest
↓
AddMaintenanceTypeRequest
```

## Update

```text
MaintenanceType
↓
toUpdateMaintenanceTypeRequest
↓
UpdateMaintenanceTypeRequest
```

## Delete

```text
number[]
↓
toDeleteMaintenanceTypesRequest
↓
DeleteMaintenanceTypesRequest
```
