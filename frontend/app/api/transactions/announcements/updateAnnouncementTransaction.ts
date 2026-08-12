import { API_BASE_URL } from "../../client/apiClient"
import {  } from "../../client/apiClient"
import {UpdateAnnouncementFrontType} from "../../../types/announcementTypes"
import {getAnnouncementsFromApi} from "../../announcements/fetchAnnouncements"
import {
            normalizeAnnouncement,
            toUpdateAnnouncementRequest
} from "../../../utils/announcementMapper"

type UpdateAnnouncementTransactionParams = {
                                            announcement: UpdateAnnouncementFrontType
                                            setAnnouncements: any
}

export async function updateAnnouncementTransaction({
                                                    announcement,
                                                    setAnnouncements
                                                    }: UpdateAnnouncementTransactionParams)
{
    console.log("updateAnnouncementTransaction")

    await fetch(
        `${API_BASE_URL}/update-announcement`,
        {
            method: "POST",
            headers: {
                        "Content-Type":
                        "application/json"
                     },
            credentials: "include",
            body: JSON.stringify(toUpdateAnnouncementRequest(announcement))
        }
    )

    const announcements =await getAnnouncementsFromApi()
    setAnnouncements(announcements.map(normalizeAnnouncement))
}