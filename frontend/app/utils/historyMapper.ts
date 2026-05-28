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

  userId:
    h.user_id ?? undefined,

  actionType:
    h.action_type,

  status:
    h.status ?? undefined,

  roomId:
    h.room_id ?? undefined,

  stockAreaId:
    h.stock_area_id ?? undefined,

  managementNumber:
    h.management_number ?? undefined,

  serialNumber:
    h.serial_number ?? undefined,

  note:
    h.note ?? undefined,

  errorCode:
    h.error_code ?? undefined,

  errorLevel:
    h.error_level ?? undefined,

  errorDetail:
    h.error_detail ?? undefined,

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

  user_id:
    h.userId ?? null,

  action_type:
    h.actionType,

  status:
    h.status ?? null,

  room_id:
    h.roomId ?? null,

  stock_area_id:
    h.stockAreaId ?? null,

  management_number:
    h.managementNumber ?? null,

  serial_number:
    h.serialNumber ?? null,

  note:
    h.note ?? null,

  error_code:
    h.errorCode ?? null,

  error_level:
    h.errorLevel ?? null,

  error_detail:
    h.errorDetail ?? null,

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