// taskMapper.ts

import {
  MaintenanceTask,
  MaintenanceTaskDB
} from "../types/taskTypes"


export const normalizeMaintenanceTask = (
  task: MaintenanceTaskDB
): MaintenanceTask => {

  return {

    id:
      task.id,

    hospitalId:
      task.hospital_id,

    deviceId:
      task.device_id,

    maintenanceTypeId:
      task.maintenance_type_id,

    dueAt:
      task.due_at,

    status:
      task.status,

    completedAt:
      task.completed_at,

    createdAt:
      task.created_at
  }
}


export const toDBMaintenanceTask = (
  task: MaintenanceTask
): MaintenanceTaskDB => {

  return {

    id:
      task.id || 0,

    hospital_id:
      task.hospitalId,

    device_id:
      task.deviceId,

    maintenance_type_id:
      task.maintenanceTypeId,

    due_at:
      task.dueAt,

    status:
      task.status,

    completed_at:
      task.completedAt ?? null,

    created_at:
      task.createdAt ?? null
  }
}