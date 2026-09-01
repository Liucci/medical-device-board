// inspectionChecklistItemTypes.ts



// =========================
// ネスト用のOption型定義
// =========================

export type InspectionChecklistItemOption = {
    value: string
    displayOrder: number
}

export type InspectionChecklistItemOptionDB = {
    id: number
    checklist_item_id: number
    value: string
    display_order: number
}
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
        options: InspectionChecklistItemOption[] | null
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
    options: InspectionChecklistItemOptionDB[] | null
    unit: string | null
}


// =========================
// API
// =========================

// Create
export type AddInspectionChecklistItemFrontType = {
    displayOrder: number
    itemName: string
    itemTypeId: number
    required: boolean
    defaultValue?: string | null
    options?: InspectionChecklistItemOption[] | null
    unit?: string | null
}

export type AddInspectionChecklistItemBackType = {
    display_order: number
    item_name: string
    item_type_id: number
    required: boolean
    default_value: string | null
    options: InspectionChecklistItemOptionDB[] | null
    unit: string | null
}


// Update
export type UpdateInspectionChecklistItemFrontType = {
    id: number
    displayOrder: number
    itemName?: string
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
    item_type_id?: number
    required?: boolean
    default_value?: string | null
    options?: InspectionChecklistItemOptionDB[] | null
    unit?: string | null
}


// Delete
export type DeleteInspectionChecklistItemsFrontType = {
    ids: number[]
}

export type DeleteInspectionChecklistItemsBackType = {
    ids: number[]
}