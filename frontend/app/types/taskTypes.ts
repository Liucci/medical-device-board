//task表示用、実施時用
export type MaintenanceTask = {
  id: number
  hospitalId?: string
  deviceId: number
  maintenanceTypeId: number
  dueAt: string
  completedAt?: string | null
  completedBy?: string | null
  createdAt?: string | null
}
//task発生時用
export type CreateMaintenanceTask = {
  deviceId: number
  maintenanceTypeId: number
  dueAt: string
}

export type MaintenanceTaskDB = {
  id: number
  hospital_id: string
  device_id: number
  maintenance_type_id: number
  due_at: string
  completed_at?: string | null
  completed_by?: string | null
  created_at?: string | null
}