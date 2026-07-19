import { AnnouncementFrontType } from "../../../types/announcementType"
import { getAnnouncementsFromApi } from "../../announcements/fetchAnnouncements"
import { normalizeAnnouncement } from "../../../utils/announcementMapper"

type FetchAnnouncementsTransactionParams = {setAnnouncements: any}

export async function fetchAnnouncementsTransaction({setAnnouncements}: FetchAnnouncementsTransactionParams)
{
    console.log("fetchAnnouncementsTransaction")

    const announcements =await getAnnouncementsFromApi()
    setAnnouncements(announcements.map(normalizeAnnouncement))
}