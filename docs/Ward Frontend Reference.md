# Ward Frontend Reference

## Purpose

WardをFrontend実装のテンプレートとする。

---

# Directory Structure

```text
types/
└─ wardTypes.ts

utils/
└─ wardMapper.ts

api/
└─ wards/
   └─ fetchWards.ts

api/
└─ transactions/
   └─ wards/
      ├─ createWardTransaction.ts
      ├─ updateWardTransaction.ts
      └─ deleteWardTransaction.ts

components/modals/
└─ WardAreaSettingsModal.tsx
```

---

# Mapper Example

```ts
normalizeWard()
```

---

# Fetch Example

```ts
getWardsFromApi()
```

---

# Transaction Example

## createWardTransaction

```text
POST /wards
↓
getWardsFromApi
↓
setWards
```

---

## updateWardTransaction

```text
POST /update-ward
↓
getWardsFromApi
↓
setWards
```

---

## deleteWardTransaction

```text
POST /delete-ward
↓
getWardsFromApi
↓
setWards

getRoomsFromApi
↓
setRooms
```

---

# State Example

```ts
const [wards,setWards]
const [rooms,setRooms]
```

---

# Reusable Mapping

```text
Ward
↓
Room
```

```text
Ward
↓
StockArea
```

```text
Ward
↓
DeviceType
```

```text
Ward
↓
DeviceModel
```

```text
Ward
↓
MaintenanceType
```
