import { API_BASE_URL } from "../client"

export async function getTasksFromApi()
{
    console.log("fetchTasks")

    const token = localStorage.getItem("access_token")
    if (!token) {return}

    const response = await fetch(
                        `${API_BASE_URL}/tasks`,
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