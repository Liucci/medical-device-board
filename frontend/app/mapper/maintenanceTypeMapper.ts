import {
  MaintenanceType,
  MaintenanceTypeDB,
  CreateMaintenanceFrontType,
  CreateMaintenanceBackType,
  UpdateMaintenanceFrontType,
  UpdateMaintenanceBackType,
  DeleteMaintenanceBackTypes,
  DeleteMaintenanceFrontTypes
} from "../types/maintenanceTypeTypes"

export const normalizeMaintenanceType =
  (m: MaintenanceTypeDB): MaintenanceType => 
          ({
            id: m.id,
            hospitalId: m.hospital_id,
            name: m.name,
            deviceTypeId: m.device_type_id,
            deviceModelId: m.device_model_id,
            intervalDays: m.interval_days,
            dependDeviceStatus: m.depend_device_status,
            warningDays: m.warning_days,
            isActive: m.is_active,
            createdAt: m.created_at
          })

export const toCreateMaintenanceTypeRequest = 
  (m: CreateMaintenanceFrontType): CreateMaintenanceBackType => 
        ({
          name: m.name,
          device_type_id: m.deviceTypeId,
          device_model_id: m.deviceModelId ?? null,
          interval_days: m.intervalDays,
          depend_device_status: m.dependDeviceStatus
        })

export const toUpdateMaintenanceTypeRequest =
  (m: UpdateMaintenanceFrontType): UpdateMaintenanceBackType => 
      ({
        id: m.id,
        name: m.name,
        interval_days: m.intervalDays,
        depend_device_status: m.dependDeviceStatus
      })

export const toDeleteMaintenanceTypesRequest =
 (m: DeleteMaintenanceFrontTypes):DeleteMaintenanceBackTypes => 
    ({
      ids:m.ids
    })