import {MaintenanceTask,MaintenanceTaskDB} from "../types/taskTypes"

export const normalizeMaintenanceTask = (t: MaintenanceTaskDB): MaintenanceTask => ({
                                                                                      id: t.id,
                                                                                      hospitalId: t.hospital_id,
                                                                                      deviceId: t.device_id,
                                                                                      maintenanceTypeId: t.maintenance_type_id,
                                                                                      dueAt: t.due_at,
                                                                                      status: t.status,
                                                                                      completedAt: t.completed_at,
                                                                                      createdAt: t.created_at
                                                                                    })

export const toCreateMaintenanceTaskRequest = (t: MaintenanceTask) => ({
                                                                          device_id: t.deviceId,
                                                                          maintenance_type_id: t.maintenanceTypeId,
                                                                          due_at: t.dueAt
                                                                        })

export const toStartMaintenanceTaskRequest = (taskId: number) => ({
                                                                     id: taskId
                                                                   })

export const toFinishMaintenanceTaskRequest = (taskId: number) => ({
                                                                      id: taskId
                                                                    })

export const toDeleteMaintenanceTasksRequest = (ids: number[]) => ({
                                                                      ids
                                                                    })