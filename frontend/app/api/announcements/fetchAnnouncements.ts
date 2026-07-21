import { API_BASE_URL, authFetch } from "../client/apiClient"

export async function getAnnouncementsFromApi()
{
    console.log("fetchAnnouncements")

    const response = await authFetch(
                        `${API_BASE_URL}/fetch-announcements`,
                        {
                          method: "GET",
                          headers: {
                                    "Content-Type":
                                    "application/json"
                                   }
                        }
                      )

    return await response.json()
}