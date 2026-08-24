import { ActiveAnnouncementBackType } from "@/app/types/announcementTypes"
import { API_BASE_URL,  } from "../client/apiClient"


export async function fetchActiveAnnouncements(): Promise<ActiveAnnouncementBackType[]>
{
    console.log("fetchActiveAnnouncements")
    const response = await fetch(
                                    `${API_BASE_URL}/fetch-active-announcements`,                                    
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            //Authorization: `Bearer ${token}`
                                        },
                                        credentials: "include",
                                    }
                                )

    return await response.json()
}