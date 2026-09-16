import { API_BASE_URL } from "../../client/apiClient"

export async function getInspectionChecklistsFromApi()
{
    console.log("fetchInspectionChecklists")

    const response = await fetch(
        `${API_BASE_URL}/inspection-checklists`,
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