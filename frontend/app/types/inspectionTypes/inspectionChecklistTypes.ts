// inspectionChecklistTypes.ts

// =========================
// Response
// =========================

export type InspectionChecklist = {
    id: number
    hospitalId: string
    inspectionTypeId: number
    deviceTypeId: number
    deviceModelId: number | null
    name: string
    version: number
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export type InspectionChecklistDB = {
    id: number
    hospital_id: string
    inspection_type_id: number
    device_type_id: number
    device_model_id: number | null
    name: string
    version: number
    is_active: boolean
    created_at: string
    updated_at: string
}


// =========================
// API
// =========================

// Create
export type AddInspectionChecklistFrontType = {
    inspectionTypeId: number
    deviceTypeId: number
    deviceModelId?: number | null
    name: string
    version?: number
}

export type AddInspectionChecklistBackType = {
    inspection_type_id: number
    device_type_id: number
    device_model_id: number | null
    name: string
    version: number
}


// Update
export type UpdateInspectionChecklistFrontType = {
    id: number
    inspectionTypeId?: number
    deviceTypeId?: number
    deviceModelId?: number | null
    name?: string
    version?: number
    isActive?: boolean
}

export type UpdateInspectionChecklistBackType = {
    id: number
    inspection_type_id?: number
    device_type_id?: number
    device_model_id?: number | null
    name?: string
    version?: number
    is_active?: boolean
}


// Delete
export type DeleteInspectionChecklistsFrontType = {
    ids: number[]
}

export type DeleteInspectionChecklistsBackType = {
    ids: number[]
}