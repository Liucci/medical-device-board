import { API_BASE_URL, authFetch } from "../client/apiClient"

export async function getRoomInfectionsFromApi()
{
    console.log("fetchRoomInfections")

    const response = await fetch(
                        `${API_BASE_URL}/room-infections`,
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