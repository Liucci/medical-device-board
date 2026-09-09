// inspectionTypes.ts

// =========================
// Response
// =========================
export type Inspection = {
    id: number
    hospitalId: string
    deviceTypeName: string
    deviceModelName: string
    managementNumber: string | null
    serialNumber: string | null
    wardName: string | null
    roomName: string | null
    patientName: string | null
    inspectionTypeName: string
    checklistName: string
    performedByName: string | null
    overallResult: string | null
    comment: string | null
    createdAt: string
}

export type InspectionDB = {
    id: number
    hospital_id: string
    device_type_name: string
    device_model_name: string
    management_number: string | null
    serial_number: string | null
    ward_name: string | null
    room_name: string | null
    patient_name: string | null
    inspection_type_name: string
    checklist_name: string
    performed_by_name: string | null
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