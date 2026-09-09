// inspectionResultTypes.ts

// =========================
// Response
// =========================

export type InspectionResult = {
    id: number
    inspectionId: number
    categoryName: string
    categoryDisplayOrder: number
    itemName: string
    itemDisplayOrder: number
    unit: string | null
    value: string | null
}

export type InspectionResultDB = {
    id: number
    inspection_id: number
    category_name: string
    category_display_order: number
    item_name: string
    item_display_order: number
    unit: string | null
    value: string | null
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