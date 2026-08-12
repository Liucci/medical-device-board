import { API_BASE_URL, } from "../client/apiClient"

export async function getTasksFromApi()
{
    console.log("fetchTasks")

    const response = await fetch(
                        `${API_BASE_URL}/tasks`,
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