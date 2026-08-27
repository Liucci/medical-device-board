// inspectionTransactionTypes.ts

// =========================
// Create Inspection Checklist Transaction
// =========================

export type CreateInspectionChecklistTransactionFrontType = {
    inspectionTypeId: number
    deviceTypeId: number
    deviceModelId?: number | null
    name: string
    version?: number

    displayOrder: number
    itemName: string
    itemTypeId: number
    required: boolean
    defaultValue?: string | null
    options?: string[] | null
    unit?: string | null
}


export type CreateInspectionChecklistTransactionBackType = {
    inspection_type_id: number
    device_type_id: number
    device_model_id: number | null
    name: string
    version: number

    display_order: number
    item_name: string
    item_type_id: number
    required: boolean
    default_value: string | null
    options: string[] | null
    unit: string | null
}