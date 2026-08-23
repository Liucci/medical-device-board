import { fetchActiveAnnouncements } from "../../announcements/fetchActiveAnnouncements"
import { normalizeActiveAnnouncement } from "../../../../app/utils/announcementMapper"

type FetchActiveAnnouncementsTransactionParams = {
                                                    
                                                    setAnnouncements: any
                                                 }

export async function fetchActiveAnnouncementsTransaction(
                                                            {
                                                                setAnnouncements
                                                            }: FetchActiveAnnouncementsTransactionParams
                                                        )
{
    console.log("fetchActiveAnnouncementsTransaction")
    const announcements = await fetchActiveAnnouncements()
    setAnnouncements(announcements.map(normalizeActiveAnnouncement))

}