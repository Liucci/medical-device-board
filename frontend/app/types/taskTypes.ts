export type MaintenanceTaskStatus =
  | "pending"
  | "completed"
  | "cancelled"


// taskTypes.ts

export type MaintenanceTask = {
  id?: number

  hospitalId?: string

  deviceId: number

  maintenanceTypeId: number

  dueAt: string

  status: string

  completedAt?: string | null

  createdAt?: string | null
}


export type MaintenanceTaskDB = {
  id: number

  hospital_id: string

  device_id: number

  maintenance_type_id: number

  due_at: string

  status: string

  completed_at?: string | null

  created_at?: string | null
}