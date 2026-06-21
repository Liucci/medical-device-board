import { API_BASE_URL,authFetch} from "../client"

export async function getRoomsFromApi()
{
    console.log("fetchRooms")

    const response = await authFetch(
                        `${API_BASE_URL}/rooms`,
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

