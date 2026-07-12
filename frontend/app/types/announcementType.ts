// Front標準型
export type AnnouncementFrontType = {
    id: number
    hospitalId: string | null
    message: string
    startAt: string
    endAt: string
    isActive: boolean
    updatedAt: string
}

// DB標準型
export type AnnouncementBackType = {
    id: number
    hospital_id: string | null
    message: string
    start_at: string
    end_at: string
    is_active: boolean
    updated_at: string
}

// Create(UI)
export type CreateAnnouncementFrontType = {
    hospitalId: string | null
    message: string
    startAt: string
    endAt: string
}

// Create(Request)
export type CreateAnnouncementBackType = {
    hospital_id: string | null
    message: string
    start_at: string
    end_at: string
}

// Update(UI)
export type UpdateAnnouncementFrontType = {
    
    hospitalId: string | null
    message: string
    startAt: string
    endAt: string
    isActive: boolean
}

// Update(Request)
export type UpdateAnnouncementBackType= {
    
    hospital_id: string | null
    message: string
    start_at: string
    end_at: string
    is_active: boolean
}