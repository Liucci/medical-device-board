// inspectionItemTypeTypes.ts

// =========================
// Response
// =========================

export type InspectionItemType = {
    id: number
    name: string
    description: string | null
    isActive: boolean
}

export type InspectionItemTypeDB = {
    id: number
    name: string
    description: string | null
    is_active: boolean
}


// =========================
// API
// =========================

export type AddInspectionItemType = {
    name: string
    description?: string | null
}

export type UpdateInspectionItemType = {
    id: number
    name: string
    description?: string | null
    isActive: boolean
}

export type DeleteInspectionItemTypes = {
    ids: number[]
}