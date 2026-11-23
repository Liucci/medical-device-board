import { API_BASE_URL } from "../../client/apiClient"
import {  } from "../../client/apiClient"
import {CreateAnnouncementFrontType} from "../../../types/announcementTypes"
import {getAnnouncementsFromApi} from "../../announcements/fetchAnnouncements"
import { createAnnouncement } from "../../announcements/createAnnouncement"
import {
    normalizeAnnouncement,
    toCreateAnnouncementRequest
} from "../../../mapper/announcementMapper"

type CreateAnnouncementTransactionParams = {
                                            announcement: CreateAnnouncementFrontType
                                            setAnnouncements: any
                                            onClose?: () => void
}

export async function createAnnouncementTransaction({
                                                    announcement,
                                                    setAnnouncements,
                                                    onClose
                                                }: CreateAnnouncementTransactionParams)
{
    console.log("createAnnouncementTransaction")
    // お知らせを新規作成
    const request = toCreateAnnouncementRequest(announcement)
    await createAnnouncement(request)

    const announcements =await getAnnouncementsFromApi()
    setAnnouncements(announcements.map(normalizeAnnouncement))
    if (onClose) {onClose()}
}