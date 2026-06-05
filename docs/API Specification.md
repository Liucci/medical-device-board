# API Specification

## Purpose

Frontend と Backend 間の契約を定義する。

---

# Ward

## GET /wards

### Response

```text
WardResponse[]
```

---

## POST /wards

### Request

```text
AddWardRequest
```

### Response

```text
WardResponse
```

---

## POST /update-ward

### Request

```text
UpdateWardRequest
```

---

## POST /delete-ward

### Request

```text
DeleteWardRequest
```

---

# Room

## GET /rooms

```text
RoomResponse[]
```

---

## POST /rooms

```text
AddRoomRequest
```

---

## POST /update-room

```text
UpdateRoomRequest
```

---

## POST /delete-rooms

```text
DeleteRoomsRequest
```

---

# Stock Area

## GET /stock-areas

```text
StockAreaResponse[]
```

---

## POST /stock-areas

```text
AddStockAreaRequest
```

---

## POST /update-stock-area

```text
UpdateStockAreaRequest
```

---

## POST /delete-stock-areas

```text
DeleteStockAreasRequest
```

---

# Device Type

## GET /device-types

```text
DeviceTypesResponse[]
```

---

## POST /device-types

```text
AddDeviceTypeRequest
```

---

## POST /update-device-type

```text
UpdateDeviceTypeRequest
```

---

## POST /delete-device-types

```text
DeleteDeviceTypesRequest
```

---

# Device Model

## GET /device-models

```text
DeviceModelsResponse[]
```

---

## POST /device-models

```text
AddDeviceModelRequest
```

---

## POST /update-device-model

```text
UpdateDeviceModelRequest
```

---

## POST /delete-device-models

```text
DeleteDeviceModelsRequest
```

---

# Dashboard

## GET /init-dashboard

### Response

```text
DashboardInitialData
```
