// inspectionChecklistItemTypes.ts

import type {
    InspectionChecklistItemOption,
    InspectionChecklistItemOptionBackType
} from "./inspectionChecklistItemOptionTypes"

// =========================
// Response
// =========================

export type InspectionChecklistItem = {
        id: number
        checklistId: number
        displayOrder: number
        itemName: string
        categoryId: number
        itemTypeId: number
        required: boolean
        defaultValue: string | null
        options: InspectionChecklistItemOption[] | null
        unit: string | null
}

export type InspectionChecklistItemDB = {
    id: number
    checklist_id: number
    display_order: number
    item_name: string
    category_id: number
    item_type_id: number
    required: boolean
    default_value: string | null
    options: InspectionChecklistItemOptionBackType[] | null
    unit: string | null
}


// =========================
// API
// =========================

// Create
export type AddInspectionChecklistItemFrontType = {
    displayOrder: number
    itemName: string
    categoryId: number
    itemTypeId: number
    required: boolean
    defaultValue?: string | null
    options?: InspectionChecklistItemOption[] | null
    unit?: string | null
}

export type AddInspectionChecklistItemBackType = {
    display_order: number
    item_name: string
    category_id: number
    item_type_id: number
    required: boolean
    default_value: string | null
    options: InspectionChecklistItemOptionBackType[] | null
    unit: string | null
}


// Update
export type UpdateInspectionChecklistItemFrontType = {
    id: number
    displayOrder: number
    itemName?: string
    categoryId?: number
    itemTypeId?: number
    required?: boolean
    defaultValue?: string | null
    options?: InspectionChecklistItemOption[] | null
    unit?: string | null
}

export type UpdateInspectionChecklistItemBackType = {
    id: number
    display_order: number
    item_name?: string
    category_id?: number
    item_type_id?: number
    required?: boolean
    default_value?: string | null
    options?: InspectionChecklistItemOptionBackType[] | null
    unit?: string | null
}


// Delete
export type DeleteInspectionChecklistItemsFrontType = {
    ids: number[]
}

export type DeleteInspectionChecklistItemsBackType = {
    ids: number[]
}