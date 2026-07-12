import {
    AnnouncementFrontType,
    AnnouncementBackType,
    CreateAnnouncementFrontType,
    CreateAnnouncementBackType,
    UpdateAnnouncementFrontType,
    UpdateAnnouncementBackType
} from "../types/announcementType"

export const normalizeAnnouncement = (
    announcement: AnnouncementBackType
): AnnouncementFrontType => ({
    id: announcement.id,
    hospitalId: announcement.hospital_id,
    message: announcement.message,
    startAt: announcement.start_at,
    endAt: announcement.end_at,
    isActive: announcement.is_active,
    updatedAt: announcement.updated_at
})

export const toCreateAnnouncementRequest = (
    announcement: CreateAnnouncementFrontType
): CreateAnnouncementBackType => ({
    hospital_id: announcement.hospitalId,
    message: announcement.message,
    start_at: announcement.startAt,
    end_at: announcement.endAt
})

export const toUpdateAnnouncementRequest = (
    announcement: UpdateAnnouncementFrontType
): UpdateAnnouncementBackType => ({
    hospital_id: announcement.hospitalId,
    message: announcement.message,
    start_at: announcement.startAt,
    end_at: announcement.endAt,
    is_active: announcement.isActive
})