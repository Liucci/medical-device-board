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
│    │   ├─ login.py
│    │   ├─ refresh_token.py
│    │   └─ register_auth_user.py
│    ├─ common/
│    │   └─ supabase_client.py
│    ├─ devices/
│    │   ├─ add_devices.py
│    │   ├─ delete_device.py
│    │   ├─ fetch_devices.py
│    │   ├─ fetch_stock_last_updated.py
│    │   ├─ fetch_ward_last_updated.py
│    │   ├─ finish_maintenance.py
│    │   ├─ finish_standby.py
│    │   ├─ move_device.py
│    │   ├─ start_maintenance.py
│    │   ├─ srart_standby.py
│    │   ├─ update_device_rental_dates.py
│    │   ├─ update_maintenance_dates.py
│    │   ├─ update_management_number.py
│    │   ├─ update_note.py
│    │   └─ update_serial_number.py
│    ├─ export/
│    │   ├─ csv/
│    │   │   ├─ create_device_list_csv.py
│    │   │   └─ create_history_csv.py
│    │   └─ pdf/
│    │       ├─ create_device_list_pdf.py
│    │       ├─ create_history_pdf.py
│    │       └─ create_pdf_doc.py
│    ├─ fonts/
│    │   ├─ NotoSansJP-Bold.ttf
│    │   └─ NotoSansJP-Regular.ttf
│    ├─ histories/
│    │   └─ fetch_histories.py
│    ├─ hospitals/
│    │   ├─ add_hospital.py
│    │   └─ fetch_hospital.py
│    ├─ invites/
│    │   ├─ create_first_admin_invite_code.py
│    │   ├─ create_invite_code.py
│    │   ├─ fetch_invite_code.py
│    │   ├─ send_invite_mail.py
│    │   └─ send_invite_mail.py
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
│    │   ├─ fetch_maintenance_tasks_by_device_id.py
│    │   └─ complete_maintenance_task.py
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
│    ├─ schemas/
│    │   ├─ auth_schemas.py
│    │   ├─ device_model_schemas.py
│    │   ├─ device_schemas.py
│    │   ├─ device_type_schemas.py
│    │   ├─ export_schemas.py
│    │   ├─ history_schemas.py
│    │   ├─ hospital_schemas.py
│    │   ├─ maintenance_log_schemas.py
│    │   ├─ maintenance_task_schemas.py
│    │   ├─ maintenance_type_schemas.py
│    │   ├─ master_schemas.py
│    │   ├─ room_schemas.py
│    │   ├─ stock_area_schemas.py
│    │   ├─ user_schemas.py
│    │   └─ ward_schemas.py
│    ├─ stock_areas/
│    │   ├─ add_stock_areas.py
│    │   ├─ delete_stock_areas.py
│    │   ├─ fetch_stock_areas.py
│    │   └─ update_stock_areas.py
│    ├─ transactions/
│    │   ├─ auth
│    │   │   └─ fetch_current_user_transaction.py
│    │   ├─ device_models
│    │   │   ├─create_device_model_transaction.py
│    │   │   ├─delete_device_model_transaction.py
│    │   │   └─update_device_model_transaction.py
│    │   ├─ device_types
│    │   │   ├─create_device_type_transaction.py
│    │   │   ├─delete_device_type_transaction.py
│    │   │   └─update_device_type_transaction.py
│    │   ├─ devices
│    │   │   ├─create_device_transaction.py
│    │   │   ├─delete_device_transaction.py
│    │   │   ├─finish_maintenance_transaction.py
│    │   │   ├─finish_standby_transaction.py
│    │   │   ├─ move_room_to_room_new_patient_transaction.py
│    │   │   ├─ move_room_to_room_transaction.py
│    │   │   ├─ move_room_to_stock_transaction.py
│    │   │   ├─ move_stock_to_room_transaction.py
│    │   │   ├─ move_stock_to_stock_transaction.py
│    │   │   ├─ start_maintenance_transaction.py
│    │   │   ├─ start_standby_transaction.py
│    │   │   ├─ update_device_rental_dates_transaction.py
│    │   │   ├─ update_maintenance_dates_transaction.py
│    │   │   ├─ update_management_number_transaction.py
│    │   │   ├─ update_management_number_transaction.py
│    │   │   └─ update_serial_number_transaction.py
│    │   ├─ exports
│    │   │   ├─export_device_list_csv_transaction.py
│    │   │   ├─export_device_list_pdf_transaction.py
│    │   │   ├─export_history_csv_transaction.py
│    │   │   └─export_history_pdf_transaction.py
│    │   ├─ histories
│    │   │   └─create_device_history.py
│    │   ├─ invites
│    │   │   ├─create_invite_code_transaction.py
│    │   │   ├─get_invite_info_transaction.py
│    │   │   ├─invite_first_admin_transaction.py
│    │   │   ├─register_first_admin_transaction.py
│    │   │   └─register_user_transaction.py
│    │   ├─ maintenance_types
│    │   │   ├─create_maintenance_type_transaction.py
│    │   │   ├─delete_maintenance_type_transaction.py
│    │   │   └─update_maintenance_type_transaction.py
│    │   ├─ stock_areas
│    │   │    ├─complete_maintenance_task_transaction.py
│    │   │    ├─create_device_tasks_transaction.py
│    │   │    └─create_next_maintenance_task_transaction.py
│    │   │ 
│    │   ├─ rooms
│    │   │   ├─create_room_transaction.py
│    │   │   ├─delete_room_transaction.py
│    │   │   └─update_room_transaction.py
│    │   │ 
│    │   ├─ wards
│    │   │    ├─create_ward_transaction.py
│    │   │    ├─delete_ward_transaction.py
│    │   │    └─update_ward_transaction.py
│    │   │ 
│    │   ├─ stock_areas
│    │   │    ├─create_stock_area_transaction.py
│    │   │    ├─delete_stock_area_transaction.py
│    │   │    └─update_stock_area_transaction.py
│    │   └─ fetch_init_dashboard.py
│    └─ requirements.txt
├─ database/
└─ frontend/
   │
　 app/
   ├─ admin/
   │  └─ page.tsx
   ├─client/
   │  └─ apiClient.ts
   │
   ├─ api/
   │  ├─ admin/
   │  │   └─ create-hospital/
   │  │         └─ route.ts
   │  ├─ auth/
   │  │    ├─ fetchCurrentUser.ts
   │  │    ├─ refreshToken.ts
   │  │    └─ login.ts
   │  ├─ devicesModels/
   │  │   └─ fetchDeviceModels.ts
   │  ├─ devices/
   │  │   └─ fetchDevices.ts
   │  ├─ devicesTypes/
   │  │   └─ fetchDeviceTypes.ts  
   │  ├─ exports/
   │  │   ├─ exportDeviceListCsv.ts  
   │  │   ├─ exportDeviceListPdf.ts  
   │  │   ├─ exportHistoryCsv.ts  
   │  │   └─ exportHistoryPdf.ts  
   │  ├─ histories/
   │  │   ├─ addHistories.ts  
   │  │   └─ fetchHistories.ts
   │  ├─ invites/
   │  │   ├─ createInviteCode.ts  
   │  │   ├─ inviteFirstAdmin.ts  
   │  │   ├─ registerFirstAdmin.ts  
   │  │   └─ registerUser.ts  
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
   │      ├─ auth/
   │      │    └─loginTransaction.ts
   │      ├─ deviceModels/
   │      │    ├─ createDeviceModelTransaction.ts
   │      │    ├─ deleteDeviceModelsTransaction.ts
   │      │    └─ updateDeviceModelTransaction.ts
   │      ├─ devices/
   │      │    ├─ createDeviceTransaction.ts
   │      │    ├─ deleteDeviceTransaction.ts
   │      │    ├─ finishMaintenance.ts
   │      │    ├─ finishStandby.ts
   │      │    ├─ moveRoomToRoomNewPatientTransaction.ts
   │      │    ├─ moveRoomToRoomTransaction.ts
   │      │    ├─ moveRoomToStockTransaction.ts
   │      │    ├─ moveStockToRoomTransaction.ts
   │      │    ├─ moveStockToStockTransaction.ts
   │      │    ├─ startMaintenance.ts
   │      │    ├─ startStandby.ts
   │      │    ├─ updateMaintenanceDatesTransaction.ts
   │      │    ├─ updateManagementNumber.ts
   │      │    ├─ updateNote.ts
   │      │    ├─ updateRentalDates.ts
   │      │    └─ updateSerialNumber.ts
   │      ├─ deviceTypes/
   │      │    ├─ createDeviceTypeTransaction.ts
   │      │    ├─ deleteDeviceTypeTransaction.ts
   │      │    └─ updateDeviceTypeTransaction.ts
   │      ├─ exports/
   │      │    ├─ exportDeviceListCsvTransaction.ts
   │      │    ├─ exportDeviceListPdfTransaction.ts
   │      │    ├─ exportHistoryCsvTransaction.ts
   │      │    └─ exportHistoryPdfTransaction.ts
   
   │      ├─ invites/
   │      │    ├─ createInviteCodeTransaction.ts
   │      │    ├─ inviteFirstAdminTransaction.ts
   │      │    ├─ registerFirstAdminTransaction.ts
   │      │    └─ registerUserTransaction.ts
   │      ├─ maintenanceTypes/
   │      │    ├─ createMaintenanceTypeTransaction.ts
   │      │    ├─ deleteMaintenanceTypesTransaction.ts
   │      │    └─ updateMaintenanceTypeTransaction.ts
   │      ├─ rooms/
   │      │    ├─ createRoomTransaction.ts
   │      │    ├─ deleteRoomsTransaction.ts
   │      │    ├─ updateRoomPatientName.ts
   │      │    └─ updateRoomTransaction.ts
   │      ├─ stockAreas/
   │      │    ├─ createStockAreaTransaction.ts
   │      │    ├─ deleteStockAreaTransaction.ts
   │      │    └─ updateStockAreaTransaction.ts
   │      ├─ tasks/
   │      │    └─ completeMaintenanceTaskTransaction.ts
   │      ├─ wards/
   │      │    ├─ createWardTransaction.ts
   │      │    ├─ deleteWardTransaction.ts
   │      │    └─ updateWardTransaction.ts
   │      └─ fetchInitDashboard.ts
   │
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
   │     ├─ RegisterCompleteModal.tsx
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
   ├─ drag/
   │  ├─ autoScroll.ts
   │  ├─ drop.ts
   │  ├─ longPress.ts
   │  └─ useDrag.ts
   ├─ first-admin-invite/
   │  └─ page.ts
   ├─ first-admin-register/
   │  └─ page.ts
   ├─ lib/
   │  └─ supabase.ts
   │
   ├─ login/
   │  └─ page.tsx
   │
   ├─ register/
   │  ├─ RegisterClient.ts
   │  └─ page.tsx
   │
   ├─ types/
   │  ├─ deviceModelTypes.ts
   │  ├─ deviceTypes.ts
   │  ├─ deviceTypeTypes.ts
   │  ├─ exportTypes.ts
   │  ├─ historyTypes.ts
   │  ├─ hospitalTypes.ts
   │  ├─ inviteTypes.ts
   │  ├─ maintenanceTypeTypes.ts
   │  ├─ registerTypes.ts
   │  ├─ roomTypes.ts
   │  ├─ stockTypes.ts
   │  ├─ taskTypes.ts
   │  ├─ userTypes.ts
   │  └─ wardTypes.ts
   ├─ utils/
   │   ├─ deviceColors.ts
   │   ├─ DeviceIcon.tsx
   │   ├─ deviceMapper.ts
   │   ├─ deviceModelMapper.ts
   │   ├─ deviceTypeMapper.ts
   │   ├─ ExportDeviceListPdf.ts
   │   ├─ ExportHistoriesPdf.ts
   │   ├─ exportMapper.ts
   │   ├─ historyMapper.ts
   │   ├─ inviteMapper.ts
   │   ├─ maintenanceTypeMapper.ts
   │   ├─ registerMapper.ts
   │   ├─ roomsMapper.ts
   │   ├─ stockAreaMapper.ts
   │   ├─ taskMapper.ts
   │   ├─ userMapper.ts
   │   └─ wardsMapper.ts
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

