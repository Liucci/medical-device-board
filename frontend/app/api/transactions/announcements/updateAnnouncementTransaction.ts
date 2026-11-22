import { API_BASE_URL } from "../../client/apiClient"
import {  } from "../../client/apiClient"
import { updateAnnouncement } from "../../announcements/updateAnnouncement"
import {UpdateAnnouncementFrontType} from "../../../types/announcementTypes"
import {getAnnouncementsFromApi} from "../../announcements/fetchAnnouncements"
import {
            normalizeAnnouncement,
            toUpdateAnnouncementRequest
} from "../../../mapper/announcementMapper"

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

    // お知らせを更新
    const request = toUpdateAnnouncementRequest(announcement)
    await updateAnnouncement(request)

    // お知らせ一覧を再取得
    const announcements =await getAnnouncementsFromApi()
    setAnnouncements(announcements.map(normalizeAnnouncement))
}