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
│    │   ├─ add_devices.py
│    │   ├─ delete_devices.py
│    │   ├─ fetch_devices.py
│    │   └─ rename_devices.py
│    ├─ histories/
│    │   ├─ fetch_histories.py
│    │   └─ add_histories.py
│    ├─ maintenance_types/
│    │   ├─ add_maintenance_types.py
│    │   ├─ delete_maintenance_types.py
│    │   ├─ fetch_maintenance_types.py
│    │   └─ rename_maintenance_types.py
│    ├─ rooms/
│    │   ├─ add_room.py
│    │   ├─ delete_room.py
│    │   ├─ fetch_room.py
│    │   └─ update_room.py
│    ├─ stock_areas/
│    │   ├─ add_stock_area.py
│    │   ├─ delete_stock_areas.py
│    │   ├─ fetch_stock_areas.py
│    │   └─ rename_stock_areas.py
│    ├─ tasks/
│    │   ├─ add_maintenance_tasks.py
│    │   ├─ delete_maintenance_tasks.py
│    │   ├─ fetch_maintenance_tasks.py
│    │   └─ rename_maintenance_tasks.py
│    ├─ users/
│    │   ├─ add_users.py
│    │   ├─ delete_users.py
│    │   ├─ fetch_users.py
│    │   └─ rename_users.py
│    ├─ wards/
│    │   ├─ add_wards.py
│    │   ├─ delete_wards.py
│    │   ├─ fetch_wards.py
│    │   └─ rename_wards.py
│    ├─ master/
│    │   ├─ add_master.py
│    │   ├─ delete_master.py
│    │   ├─ fetch_master.py
│    │   └─ rename_master.py
│    ├─ schemas/
│    │   ├─ device_model_schemas.py
│    │   ├─ device_schemas.py
│    │   ├─ history_schemas.py
│    │   ├─ maintenance_log_schemas.py
│    │   ├─ maintenance_task_schemas.py
│    │   ├─ maintenance_type_schemas.py
│    │   ├─ master_schemas.py
│    │   ├─ room_schemas.py
│    │   ├─ stock_area_schemas.py
│    │   ├─ user_schemas.py
│    │   └─ ward_schemas.py
│    ├─ transactions/
│    │   ├─ create_device_transaction.py
│    │   └─ fetch_init_dashboard.py
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
   │  ├─ wards/
   │  │   └─ fetchWards.ts
   │  └─ transactions/
   │      ├─ createDeviceTransaction.ts
   │      └─ fetchInitDashboard.ts
   │
   ├─ auth/
   │  └─ services/
   │       └─ inviteService.ts
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
   │   ├─ maintenanceTypeMapper.ts
   │   ├─ masterMapper.ts
   │   ├─ taskMapper.ts
   │   ├─ historyMapper.ts
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

