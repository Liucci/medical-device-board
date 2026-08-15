// inspectionTypeTypes.ts

// =========================
// Response
// =========================

export type InspectionType = {
    id: number
    name: string
    isActive: boolean
}

export type InspectionTypeDB = {
    id: number
    name: string
    is_active: boolean
}


// =========================
// API
// =========================

export type CreateInspectionType = {
    name: string
}

export type UpdateInspectionType = {
    id: number
    name: string
    isActive: boolean
}

export type DeleteInspectionTypes = {
    ids: number[]
}