// inspectionChecklistItemTypes.ts

// =========================
// Response
// =========================

export type InspectionChecklistItem = {
    id: number
    checklistId: number
    displayOrder: number
    itemName: string
    itemTypeId: number
    required: boolean
    defaultValue: string | null
    options: string[] | null
    unit: string | null
}

export type InspectionChecklistItemDB = {
    id: number
    checklist_id: number
    display_order: number
    item_name: string
    item_type_id: number
    required: boolean
    default_value: string | null
    options: string[] | null
    unit: string | null
}


// =========================
// API
// =========================

export type CreateInspectionChecklistItem = {
    checklistId: number
    itemName: string
    itemTypeId: number
    required: boolean
    defaultValue?: string | null
    options?: string[] | null
    unit?: string | null
}

export type UpdateInspectionChecklistItem = {
    id: number
    itemName?: string
    itemTypeId?: number
    required?: boolean
    defaultValue?: string | null
    options?: string[] | null
    unit?: string | null
}

export type DeleteInspectionChecklistItems = {
    ids: number[]
}

export type UpdateInspectionChecklistItemOrder = {
    id: number
    displayOrder: number
}

export type UpdateInspectionChecklistItemOrders = {
    items: UpdateInspectionChecklistItemOrder[]
}