// inspectionTransactionTypes.ts

// Create Inspection Checklist Transaction用Type定義
//新規作成用
export type CreateInspectionChecklistTransactionFrontType = {
    inspectionTypeId: number
    deviceTypeId: number
    deviceModelId?: number | null
    name: string
    version: number

    items: {
        displayOrder: number
        itemName: string
        itemTypeId: number
        required: boolean
        defaultValue?: string | null

        options?: {
                    value: string
                    displayOrder: number
        }[] | null     

        unit?: string | null
    }[]
}

export type CreateInspectionChecklistTransactionBackType = {
    inspection_type_id: number
    device_type_id: number
    device_model_id: number | null
    name: string
    version: number

    items: {
        display_order: number
        item_name: string
        item_type_id: number
        required: boolean
        default_value: string | null

        options: {
                    value: string
                    display_order: number
        }[] | null

        unit: string | null
    }[]
}


// Create Inspection Checklist New Version Transaction
//新verとしてあたらに点検表を登録する
export type CreateInspectionChecklistNewVerTransactionFrontType = {
    inspectionTypeId: number
    deviceTypeId: number
    deviceModelId?: number | null
    name: string
    version: number

    items: {
        displayOrder: number
        itemName: string
        itemTypeId: number
        required: boolean
        defaultValue?: string | null

        options?: {
                    value: string
                    displayOrder: number
        }[] | null    

        unit?: string | null
    }[]
}


export type CreateInspectionChecklistNewVerTransactionBackType = {
    inspection_type_id: number
    device_type_id: number
    device_model_id: number | null
    name: string
    version: number

    items: {
        display_order: number
        item_name: string
        item_type_id: number
        required: boolean
        default_value: string | null

        options: {
                    value: string
                    display_order: number
        }[] | null 
               
        unit: string | null
    }[]
}