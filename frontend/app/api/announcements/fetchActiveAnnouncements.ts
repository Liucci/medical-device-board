import { ActiveAnnouncementBackType } from "@/app/types/announcementType"

type FetchActiveAnnouncementsParams = {hospitalId: string}

export async function fetchActiveAnnouncements(
                                            { hospitalId }: FetchActiveAnnouncementsParams
                                        ): Promise<ActiveAnnouncementBackType[]>
{
    console.log("fetchActiveAnnouncements")
    const token = localStorage.getItem("access_token")
    const response = await fetch(
                                    `${process.env.NEXT_PUBLIC_API_URL}/fetch-active-announcements`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${token}`
                                        },
                                        body: JSON.stringify({hospital_id: hospitalId})
                                    }
                                )

    return await response.json()
}