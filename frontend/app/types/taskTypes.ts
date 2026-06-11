export type MaintenanceTask = {
  id?: number
  hospitalId?: string
  deviceId: number
  maintenanceTypeId: number
  dueAt: string
  completedAt?: string | null
  completedBy?: string | null
  createdAt?: string | null
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