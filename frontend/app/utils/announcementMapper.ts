import {
        AnnouncementFrontType,
        AnnouncementBackType,
        CreateAnnouncementFrontType,
        CreateAnnouncementBackType,
        UpdateAnnouncementFrontType,
        UpdateAnnouncementBackType,
        CreateAnnouncementCRUDFrontType,
        CreateAnnouncementCRUDBackType,
        UpdateAnnouncementCRUDFrontType,
        UpdateAnnouncementCRUDBackType
} from "../types/announcementType"

export const normalizeAnnouncement = (
            announcement: AnnouncementBackType
                        ): AnnouncementFrontType => ({
                            id: announcement.id,
                            hospitalIds: announcement.hospital_ids,
                            message: announcement.message,
                            startAt: announcement.start_at,
                            endAt: announcement.end_at,
                            isActive: announcement.is_active,
                            createdAt: announcement.created_at,
                            updatedAt: announcement.updated_at
})

export const toCreateAnnouncementRequest = (
                announcement: CreateAnnouncementFrontType
                            ): CreateAnnouncementBackType => ({
                                hospital_ids: announcement.hospitalIds,
                                message: announcement.message,
                                start_at: announcement.startAt,
                                end_at: announcement.endAt
})

export const toUpdateAnnouncementRequest = (
                announcement: UpdateAnnouncementFrontType
                            ): UpdateAnnouncementBackType => ({
                                id: announcement.id,
                                hospital_ids: announcement.hospitalIds,
                                message: announcement.message,
                                start_at: announcement.startAt,
                                end_at: announcement.endAt,
                                is_active: announcement.isActive
})


export const toCreateAnnouncementCRUDRequest = (
                    announcement: CreateAnnouncementCRUDFrontType
                                ): CreateAnnouncementCRUDBackType => ({
                                    message: announcement.message,
                                    start_at: announcement.startAt,
                                    end_at: announcement.endAt
})

export const toUpdateAnnouncementCRUDRequest = (
                announcement: UpdateAnnouncementCRUDFrontType
                            ): UpdateAnnouncementCRUDBackType => ({
                                id: announcement.id,
                                message: announcement.message,
                                start_at: announcement.startAt,
                                end_at: announcement.endAt,
                                is_active: announcement.isActive
})