import {
  History,
  HistoryDB
} from "../types/historyTypes"

// DB → Front
export const normalizeHistory = (
  h: HistoryDB
): History => ({

  id: h.id,

  deviceId:
    h.device_id,


  actionType:
    h.action_type,



  managementNumber:
    h.management_number ?? undefined,

  serialNumber:
    h.serial_number ?? undefined,

  note:
    h.note ?? undefined,


  message:
    h.message ?? undefined,

  createdAt:
    h.created_at,

  patientName:
    h.patient_name ?? undefined,

  deviceTypeName:
    h.device_type_name ?? undefined,

  deviceModelName:
    h.device_model_name ?? undefined,

  roomName:
    h.room_name ?? undefined,

  stockAreaName:
    h.stock_area_name ?? undefined,

  maintenanceStartedAt:
    h.maintenance_started_at ?? undefined,

  maintenanceFinishedAt:
    h.maintenance_finished_at ?? undefined,

  standbyStartedAt:
    h.standby_started_at ?? undefined,

  standbyFinishedAt:
    h.standby_finished_at ?? undefined,

  hospitalId:
    h.hospital_id,

  actionBy:
    h.action_by ?? undefined
})


// Front → DB
export const toDBHistory = (
  h: History
) => ({

  id:
    h.id,

  device_id:
    h.deviceId,


  action_type:
    h.actionType,


  management_number:
    h.managementNumber ?? null,

  serial_number:
    h.serialNumber ?? null,

  note:
    h.note ?? null,


  message:
    h.message ?? null,

  created_at:
    h.createdAt,

  patient_name:
    h.patientName ?? null,

  device_type_name:
    h.deviceTypeName ?? null,

  device_model_name:
    h.deviceModelName ?? null,

  room_name:
    h.roomName ?? null,

  stock_area_name:
    h.stockAreaName ?? null,

  maintenance_started_at:
    h.maintenanceStartedAt ?? null,

  maintenance_finished_at:
    h.maintenanceFinishedAt ?? null,

  standby_started_at:
    h.standbyStartedAt ?? null,

  standby_finished_at:
    h.standbyFinishedAt ?? null,

  hospital_id:
    h.hospitalId,

  action_by:
    h.actionBy ?? null
})