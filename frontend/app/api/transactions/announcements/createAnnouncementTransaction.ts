import { API_BASE_URL } from "../../client/apiClient"
import { authFetch } from "../../client/apiClient"

import {CreateAnnouncementFrontType} from "../../../types/announcementType"

import {getAnnouncementsFromApi} from "../../announcements/fetchAnnouncements"

import {
    normalizeAnnouncement,
    toCreateAnnouncementRequest
} from "../../../utils/announcementMapper"

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
    await authFetch(
        `${API_BASE_URL}/create-announcement`,
        {
            method: "POST",
            headers: {
                        "Content-Type":
                        "application/json"
                     },
            body: JSON.stringify(toCreateAnnouncementRequest(announcement))
        }
    )

    const announcements =await getAnnouncementsFromApi()
    setAnnouncements(announcements.map(normalizeAnnouncement))
    if (onClose) {onClose()}
}