// =========================
// Response
// =========================

export type AnnouncementFrontType = {
    id: number
    hospitalIds: string[]
    message: string
    startAt: string
    endAt: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export type AnnouncementBackType = {
    id: number
    hospital_ids: string[]
    message: string
    start_at: string
    end_at: string
    is_active: boolean
    created_at: string
    updated_at: string
}

// =========================
// API
// =========================

export type CreateAnnouncementFrontType = {
    hospitalIds: string[]
    message: string
    startAt: string
    endAt: string
}

export type CreateAnnouncementBackType = {
    hospital_ids: string[]
    message: string
    start_at: string
    end_at: string
}

export type UpdateAnnouncementFrontType = {
    id: number
    hospitalIds: string[]
    message: string
    startAt: string
    endAt: string
    isActive: boolean
}

export type UpdateAnnouncementBackType = {
    id: number
    hospital_ids: string[]
    message: string
    start_at: string
    end_at: string
    is_active: boolean
}

// =========================
// CRUD
// =========================

export type CreateAnnouncementCRUDFrontType = {
    message: string
    startAt: string
    endAt: string
}

export type CreateAnnouncementCRUDBackType = {
    message: string
    start_at: string
    end_at: string
}

export type UpdateAnnouncementCRUDFrontType = {
    id: number
    message: string
    startAt: string
    endAt: string
    isActive: boolean
}

export type UpdateAnnouncementCRUDBackType = {
    id: number
    message: string
    start_at: string
    end_at: string
    is_active: boolean
}