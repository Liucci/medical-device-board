// inspectionItemTypeTypes.ts


// =========================
// Response
// =========================

export type InspectionItemType = {

    id: number
    name: string
    description: string | null
    inputType: string
    isCustomOption: boolean
    options: string[] | null
    isActive: boolean

}

export type InspectionItemTypeDB = {

    id: number
    name: string
    description: string | null
    input_type: string
    is_custom_option: boolean
    options: string[] | null
    is_active: boolean

}


// =========================
// API
// =========================

export type AddInspectionItemFrontType = {

    name: string
    description?: string | null
    inputType: string
    isCustomOption: boolean
    options?: string[] | null

}

export type AddInspectionItemBackType = {

    name: string
    description?: string | null
    input_type: string
    is_custom_option: boolean
    options?: string[] | null

}


export type UpdateInspectionItemFrontType = {

    id: number
    name: string
    description?: string | null
    inputType: string
    isCustomOption: boolean
    options?: string[] | null
    isActive: boolean

}

export type UpdateInspectionItemBackType = {

    id: number
    name: string
    description?: string | null
    input_type: string
    is_custom_option: boolean
    options?: string[] | null
    is_active: boolean

}


export type DeleteInspectionItemTypes = {

    ids: number[]

}