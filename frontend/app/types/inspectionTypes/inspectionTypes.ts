// inspectionTypes.ts

// =========================
// Response
// =========================

export type Inspection = {
    id: number
    hospitalId: string
    deviceId: number
    roomId: number | null
    inspectionTypeId: number
    checklistId: number
    performedBy: string | null
    overallResult: string | null
    comment: string | null
    createdAt: string
}

export type InspectionDB = {
    id: number
    hospital_id: string
    device_id: number
    room_id: number | null
    inspection_type_id: number
    checklist_id: number
    performed_by: string | null
    overall_result: string | null
    comment: string | null
    created_at: string
}


// =========================
// API
// =========================

export type AddInspectionFrontType = {
    deviceId: number
    roomId?: number | null
    inspectionTypeId: number
    checklistId: number
    overallResult?: string | null
    comment?: string | null
}

export type AddInspectionBackType = {
    device_id: number
    room_id?: number | null
    inspection_type_id: number
    checklist_id: number
    overall_result?: string | null
    comment?: string | null
}

export type UpdateInspectionFrontType = {
    id: number
    roomId?: number | null
    inspectionTypeId?: number
    checklistId?: number
    overallResult?: string | null
    comment?: string | null
}

export type UpdateInspectionBackType = {
    id: number
    room_id?: number | null
    inspection_type_id?: number
    checklist_id?: number
    overall_result?: string | null
    comment?: string | null
}

export type DeleteInspections = {
    ids: number[]
}