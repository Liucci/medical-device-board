// inspectionTypeTypes.ts

// =========================
// Response
// =========================

export type InspectionType = {
    id: number
    hospitalId: string | null
    name: string
    isActive: boolean
}

export type InspectionTypeDB = {
    id: number
    hospital_id: string | null
    name: string
    is_active: boolean
}


// =========================
// API
// =========================

export type CreateInspectionTypeFrontType = {
    name: string
}
export type CreateInspectionTypeBackType = {
    name: string
}

export type UpdateInspectionTypeFrontType = {
    id: number
    name: string
    isActive: boolean
}
export type UpdateInspectionTypeBackTYpe = {
    id: number
    name: string
    is_active: boolean
}

