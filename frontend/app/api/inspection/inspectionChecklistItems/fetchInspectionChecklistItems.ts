import { API_BASE_URL } from "../../client/apiClient"

export async function getInspectionChecklistItemsFromApi(
    checklistId: number
)
{
    console.log("fetchInspectionChecklistItems")

    const response = await fetch(
        `${API_BASE_URL}/inspection-checklist-items/${checklistId}`,
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