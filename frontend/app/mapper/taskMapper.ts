import {
        MaintenanceTask,
        MaintenanceTaskDB,
        CreateMaintenanceTask,
        UpdateMaintenanceTaskDueAt,
        CancelMaintenanceTask,
        CompleteMaintenanceTask,
        DeleteMaintenanceTasks
      }from "../types/taskTypes"

export const normalizeMaintenanceTask = (t: MaintenanceTaskDB): MaintenanceTask => ({
                                                                                      id: t.id,
                                                                                      hospitalId: t.hospital_id,
                                                                                      deviceId: t.device_id,
                                                                                      maintenanceTypeId: t.maintenance_type_id,
                                                                                      dueAt: t.due_at,
                                                                                      completedAt: t.completed_at,
                                                                                      completedBy: t.completed_by,
                                                                                      createdAt: t.created_at,
                                                                                      isActive: t.is_active,
                                                                                    })

export const toCreateMaintenanceTaskRequest = (t: CreateMaintenanceTask) => ({
                                                                          device_id: t.deviceId,
                                                                          maintenance_type_id: t.maintenanceTypeId,
                                                                          due_at: t.dueAt
                                                                        })

export const toCompleteMaintenanceTaskRequest = (task: CompleteMaintenanceTask) => ({
                                                                        id: task.id
                                                                      })

export const toDeleteMaintenanceTasksRequest = (task:DeleteMaintenanceTasks) => ({
                                                                      ids:task.ids
                                                                    })

export const toUpdateMaintenanceTaskDueAtRequest = (task:UpdateMaintenanceTaskDueAt) => ({
                                                                                          id: task.id,
                                                                                          due_at: task.dueAt
                                                                                        })

export const toCancelMaintenanceTaskRequest = (task: CancelMaintenanceTask) => ({
                                                                                  id: task.id,
                                                                                  is_active: task.isActive
                                                                                })