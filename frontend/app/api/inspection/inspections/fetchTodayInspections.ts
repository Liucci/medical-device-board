import { API_BASE_URL } from "../../client/apiClient"

export async function getTodayInspectionsFromApi()
{
    console.log("fetchTodayInspections")

    const response = await fetch(
        `${API_BASE_URL}/inspections/today`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        }
    )

    return await response.json()
}