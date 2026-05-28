import {
  MaintenanceType,
  MaintenanceTypeDB
} from "../types/maintenanceTypeTypes"


export const normalizeMaintenanceType = (
  maintenanceType: MaintenanceTypeDB
): MaintenanceType => {

  return {

    id:
      maintenanceType.id,

    hospitalId:
      maintenanceType.hospital_id,

    name:
      maintenanceType.name,

    deviceTypeId:
      maintenanceType.device_type_id,

    deviceModelId:
      maintenanceType.device_model_id,

    intervalDays:
      maintenanceType.interval_days,

    warningDays:
      maintenanceType.warning_days,

    autoCreateOnDrop:
      maintenanceType.auto_create_on_drop,

    isActive:
      maintenanceType.is_active,

    createdAt:
      maintenanceType.created_at
  }
}


export const toDBMaintenanceType = (
  maintenanceType: MaintenanceType
): MaintenanceTypeDB => {

  return {

    id:
      maintenanceType.id || 0,

    hospital_id:
      maintenanceType.hospitalId,

    name:
      maintenanceType.name,

    device_type_id:
      maintenanceType.deviceTypeId,

    device_model_id:
      maintenanceType.deviceModelId ?? null,

    interval_days:
      maintenanceType.intervalDays,

    warning_days:
      maintenanceType.warningDays ?? null,

    auto_create_on_drop:
      maintenanceType.autoCreateOnDrop ?? null,

    is_active:
      maintenanceType.isActive ?? null,

    created_at:
      maintenanceType.createdAt ?? null
  }
}