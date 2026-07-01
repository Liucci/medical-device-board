import { API_BASE_URL, authFetch } from "../client"

export async function getRoomInfectionsFromApi()
{
    console.log("fetchRoomInfections")

    const response = await authFetch(
                        `${API_BASE_URL}/room-infections`,
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