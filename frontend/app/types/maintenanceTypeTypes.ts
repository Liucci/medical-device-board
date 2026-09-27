// Frontend標準型
export type MaintenanceType = {
                                id: number
                                hospitalId: string
                                name: string
                                deviceTypeId: number
                                deviceModelId?: number | null
                                intervalDays: number
                                dependDeviceStatus: string
                                warningDays?: number | null
                                isActive?: boolean | null
                                createdAt?: string | null
                              }

// Backend Response型
export type MaintenanceTypeDB = {
                                  id: number
                                  hospital_id: string
                                  name: string
                                  device_type_id: number
                                  device_model_id?: number | null
                                  interval_days: number
                                  depend_device_status: string
                                  warning_days?: number | null
                                  is_active?: boolean | null
                                  created_at?: string | null
                                }

// Create専用
export type CreateMaintenanceFrontType = {
                                      name: string
                                      deviceTypeId: number
                                      deviceModelId?: number | null
                                      intervalDays: number
                                      dependDeviceStatus: string
                                    }

export type CreateMaintenanceBackType = {
                                      name: string
                                      device_type_id: number
                                      device_model_id?: number | null
                                      interval_days: number
                                      depend_device_status: string
                                    }

// Update専用
export type UpdateMaintenanceFrontType = {
                                      id: number
                                      name: string
                                      intervalDays: number
                                      dependDeviceStatus: string
                                    }

export type UpdateMaintenanceBackType = {
                                      id: number
                                      name: string
                                      interval_days: number
                                      depend_device_status: string
                                    }

// Delete専用
export type DeleteMaintenanceFrontTypes = {
                                      ids: number[]
                                    }

export type DeleteMaintenanceBackTypes = {
                                      ids: number[]
                                    }