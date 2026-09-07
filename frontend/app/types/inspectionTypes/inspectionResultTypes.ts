// inspectionResultTypes.ts

// =========================
// Response
// =========================

export type InspectionResult = {
    id: number
    inspectionId: number
    checklistItemId: number
    value: string | null
    categoryName: string
    categoryDisplayOrder: number
}

export type InspectionResultDB = {
    id: number
    inspection_id: number
    checklist_item_id: number
    value: string | null
    category_name: string
    category_display_order: number
}

// =========================
// API
// =========================

// Create

export type AddInspectionResultFrontType = {
    checklistItemId: number
    value?: string | null
}

export type AddInspectionResultBackType = {
    checklist_item_id: number
    value: string | null
}


// Update

export type UpdateInspectionResultFrontType = {
    id: number
    value?: string | null
}

export type UpdateInspectionResultBackType = {
    id: number
    value?: string | null
}


// Delete

export type DeleteInspectionResults = {
    ids: number[]
}