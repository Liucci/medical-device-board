import { fetchActiveAnnouncements } from "../../announcements/fetchActiveAnnouncements"
import { normalizeActiveAnnouncement } from "../../../../app/utils/announcementMapper"

type FetchActiveAnnouncementsTransactionParams = {
                                                    hospitalId: string
                                                    setAnnouncements: any
                                                 }

export async function fetchActiveAnnouncementsTransaction(
                                                            {
                                                                hospitalId,
                                                                setAnnouncements
                                                            }: FetchActiveAnnouncementsTransactionParams
                                                        )
{
    console.log("fetchActiveAnnouncementsTransaction")
    const announcements = await fetchActiveAnnouncements({ hospitalId })
    setAnnouncements(announcements.map(normalizeActiveAnnouncement))
}