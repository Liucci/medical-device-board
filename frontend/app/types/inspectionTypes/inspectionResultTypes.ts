// inspectionResultTypes.ts

// =========================
// Response
// =========================

export type InspectionResult = {
    id: number
    inspectionId: number
    checklistItemId: number
    value: string | null
}

export type InspectionResultDB = {
    id: number
    inspection_id: number
    checklist_item_id: number
    value: string | null
}


// =========================
// API
// =========================

export type CreateInspectionResult = {
    inspectionId: number
    checklistItemId: number
    value?: string | null
}

export type UpdateInspectionResult = {
    id: number
    value?: string | null
}

export type DeleteInspectionResults = {
    ids: number[]
}