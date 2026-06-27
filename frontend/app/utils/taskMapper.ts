import {
        MaintenanceTask,
        MaintenanceTaskDB,
        CreateMaintenanceTask
      }from "../types/taskTypes"

export const normalizeMaintenanceTask = (t: MaintenanceTaskDB): MaintenanceTask => ({
                                                                                      id: t.id,
                                                                                      hospitalId: t.hospital_id,
                                                                                      deviceId: t.device_id,
                                                                                      maintenanceTypeId: t.maintenance_type_id,
                                                                                      dueAt: t.due_at,
                                                                                      completedAt: t.completed_at,
                                                                                      completedBy: t.completed_by,
                                                                                      createdAt: t.created_at
                                                                                    })

export const toCreateMaintenanceTaskRequest = (t: CreateMaintenanceTask) => ({
                                                                          device_id: t.deviceId,
                                                                          maintenance_type_id: t.maintenanceTypeId,
                                                                          due_at: t.dueAt
                                                                        })

export const toCompleteMaintenanceTaskRequest = (taskId: number) => ({
                                                                        id: taskId
                                                                      })

export const toDeleteMaintenanceTasksRequest = (ids: number[]) => ({
                                                                      ids
                                                                    })