import {MaintenanceType,MaintenanceTypeDB} from "../types/maintenanceTypeTypes"

export const normalizeMaintenanceType = (m: MaintenanceTypeDB): MaintenanceType => ({
                                                                                      id: m.id,
                                                                                      hospitalId: m.hospital_id,
                                                                                      name: m.name,
                                                                                      deviceTypeId: m.device_type_id,
                                                                                      deviceModelId: m.device_model_id,
                                                                                      intervalDays: m.interval_days,
                                                                                      warningDays: m.warning_days,
                                                                                      autoCreateOnDrop: m.auto_create_on_drop,
                                                                                      isActive: m.is_active,
                                                                                      createdAt: m.created_at
                                                                                    })

export const toCreateMaintenanceTypeRequest = (m: MaintenanceType) => ({
                                                                          name: m.name,
                                                                          device_type_id: m.deviceTypeId,
                                                                          device_model_id: m.deviceModelId ?? null,
                                                                          interval_days: m.intervalDays
                                                                        })

export const toUpdateMaintenanceTypeRequest = (m: MaintenanceType) => ({
                                                                          id: m.id,
                                                                          name: m.name,
                                                                          interval_days: m.intervalDays
                                                                        })

export const toDeleteMaintenanceTypesRequest = (ids: number[]) => ({
                                                                      ids
                                                                    })