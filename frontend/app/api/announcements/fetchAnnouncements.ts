import { API_BASE_URL,  } from "../client/apiClient"

export async function getAnnouncementsFromApi()
{
    console.log("fetchAnnouncements")

    const response = await fetch(
                        `${API_BASE_URL}/fetch-announcements`,
                        {
                          method: "GET",
                          headers: {
                                    "Content-Type":
                                    "application/json"
                                   },
                        credentials: "include",
                        }
                      )

    return await response.json()
}