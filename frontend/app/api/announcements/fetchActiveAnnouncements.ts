import { ActiveAnnouncementBackType } from "@/app/types/announcementTypes"
import { API_BASE_URL,  } from "../client/apiClient"

type FetchActiveAnnouncementsParams = {hospitalId: string}

export async function fetchActiveAnnouncements(
                                            { hospitalId }: FetchActiveAnnouncementsParams
                                        ): Promise<ActiveAnnouncementBackType[]>
{
    console.log("fetchActiveAnnouncements")
    //const token = localStorage.getItem("access_token")
    //console.log("access token:",token)
    const response = await fetch(
                                    `${API_BASE_URL}/fetch-active-announcements`,                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            //Authorization: `Bearer ${token}`
                                        },
                                        credentials: "include",
                                        //body: JSON.stringify({hospital_id: hospitalId})
                                    }
                                )

    return await response.json()
}