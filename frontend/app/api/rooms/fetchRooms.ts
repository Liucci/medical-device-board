import { API_BASE_URL,} from "../client/apiClient"

export async function getRoomsFromApi()
{
    console.log("fetchRooms")

    const response = await fetch(
                        `${API_BASE_URL}/rooms`,
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

