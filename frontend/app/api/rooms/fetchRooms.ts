import { API_BASE_URL } from "../client"

export async function getRoomsFromApi()
{
    console.log("fetchRooms")
    const token = localStorage.getItem("access_token")
    if (!token) {return}

    const response = await fetch(
                        `${API_BASE_URL}/rooms`,
                        {
                          method: "GET",
                          headers: {
                                      Authorization:
                                        `Bearer ${token}`
                                    }
                        }
                      )

    return await response.json()
}

