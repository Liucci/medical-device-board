# Project Folder Structure

> File extensions are included where available.

```text
.
├─ backend/
│    ├─ main.py
│    ├─ .env
│    ├─ requirements.txt
│    ├─ auth/
│    │   ├─ fetch_current_user.py
│    │   ├─ get_auth_user_id/py
│    │   └─ login.py
│    ├─ common/
│    │   └─ supabase_client.py
│    ├─ devices/
│    │   └─ fetch_devices.py
│    ├─ histories/
│    │   └─ fetch_histories.py
│    ├─ maintenance_types/
│    │   └─ fetch_maintenance_types.py
│    ├─ rooms/
│    │   └─ fetch_rooms.py
│    ├─ stock_areas/
│    │   └─ fetch_stock_areas.py
│    ├─ tasks/
│    │   └─ fetch_tasks.py
│    ├─ users/
│    │   └─ fetch_users.py
│    ├─ wards/
│    │   └─ fetch_wards.py
│    ├─ master/
│    │   └─ fetch_master.py
│    └─ requirements.txt
├─ database/
├─ frontend/
│
└─ app/
   ├─ admin/
   │  └─ page.tsx
   │
   ├─ api/
   │  ├─client.ts
   │  ├─ admin/
   │  │   └─ create-hospital/
   │  │         └─ route.ts
   │  ├─ auth/
   │  │   └─ login.ts
   │  ├─ devices/
   │  │   └─ fetchDevices.ts
   │  ├─ histories/
   │  │   └─ fetchHistories.ts
   │  ├─ maintenanceTypes/
   │  │   └─ fetchMaintenanceTypes.ts
   │  ├─ master/
   │  │   └─ fetchMaster.ts
   │  ├─ rooms/
   │  │   └─ fetchRooms.ts
   │  ├─ stocAreas/
   │  │   └─ fetchStockAreas.ts
   │  ├─ tasks/
   │  │   └─ fetchTasks.ts
   │  └─ wards/
   │     └─ fetchWards.ts
   │
   ├─ auth/
   │  └─ services/
   │     └─ inviteService.ts
   │
   ├─ components/
   │  ├─ ButtonGrid.tsx
   │  ├─ ButtonPanel.tsx
   │  ├─ DragLayer.tsx
   │  ├─ LowStockPanel.tsx
   │  ├─ RoomContainer.tsx
   │  ├─ Stock.tsx
   │  ├─ StockGrid.tsx
   │  ├─ WardArea.tsx
   │  ├─ WardGrid.tsx
   │  │
   │  └─ modals/
   │     ├─ AdminCreateUserModal.tsx
   │     ├─ DeviceListModal.tsx
   │     ├─ DeviceModal.tsx
   │     ├─ DeviceTypeSettingsModal.tsx
   │     ├─ HistoryModal.tsx
   │     ├─ InviteCreateModal.tsx
   │     ├─ MaintenanceTypeSettingsModal.tsx
   │     ├─ RoomModal.tsx
   │     ├─ RoomToRoomModal.tsx
   │     ├─ SettingsModal.tsx
   │     ├─ StockAreaSettingsModal.tsx
   │     ├─ StockInfoModal.tsx
   │     └─ WardAreaSettingsModal.tsx
   │
   ├─ contexts/
   │  └─ AuthContext.tsx
   │
   ├─ dashboard/
   │  └─ page.tsx
   │
   ├─ lib/
   │  └─ supabase.ts
   │
   ├─ login/
   │  └─ page.tsx
   │
   ├─ register/
   │  └─ page.tsx
   │
   ├─ types/
   │  ├─ deviceTypes.ts
   │  ├─ hospitalTypes.ts
   │  ├─ roomTypes.ts
   │  ├─ stockTypes.ts
   │  └─ userTypes.ts
   │
   ├─ utils/
   │   ├─ deviceColors.ts
   │   ├─ DeviceIcon.tsx
   │   ├─ deviceMapper.ts
   │   ├─ ExportDeviceListPdf.ts
   │   ├─ ExportHistoriesPdf.ts
   │   ├─ roomsMapper.ts
   │   ├─ stockAreaMapper.ts
   │   ├─ userMapper.ts
   │   ├─ wardsMapper.ts
   │   │
   │   └─ pdf/
   │       └─ createPdfDoc.ts
   │
   ├─ global.css
   ├─ layout.tsx
   ├─ page.module.css
   └─ page.tsx


   

---

# Formatting Rules Applied

## Tree Structure Rules

* `├─` : intermediate item
* `└─` : final item in the directory
* `│` : maintains vertical hierarchy
* Directory names end with `/`
* File names include extensions
* Indentation represents parent-child relationships

## Notes

* The original file structure was preserved.
* Only formatting and hierarchy expression were normalized.
* Duplicate or malformed indentation was corrected.
* The structure now follows a common Markdown tree notation used in software documentation.

## Recommendation

As the project grows, continue maintaining this file in:

```text
/docs/folder_structure.md
```

This will help both humans and AI understand the project architecture quickly.

