import { API_BASE_URL } from "../../client/apiClient"

export async function getInspectionsFromApi()
{
    console.log("fetchInspections")

    const response = await fetch(
        `${API_BASE_URL}/inspections`,
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