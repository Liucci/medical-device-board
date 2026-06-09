// Frontend標準型
export type MaintenanceType = {
                                id: number
                                hospitalId: string
                                name: string
                                deviceTypeId: number
                                deviceModelId?: number | null
                                intervalDays: number
                                warningDays?: number | null
                                autoCreateOnDrop?: boolean | null
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
                                  warning_days?: number | null
                                  auto_create_on_drop?: boolean | null
                                  is_active?: boolean | null
                                  created_at?: string | null
                                }

// Create専用
export type CreateMaintenanceType = {
                                      name: string
                                      deviceTypeId: number
                                      deviceModelId?: number | null
                                      intervalDays: number
                                    }

// Update専用
export type UpdateMaintenanceType = {
                                      id: number
                                      name: string
                                      intervalDays: number
                                    }

// Delete専用
export type DeleteMaintenanceTypes = {
                                       ids: number[]
                                     }