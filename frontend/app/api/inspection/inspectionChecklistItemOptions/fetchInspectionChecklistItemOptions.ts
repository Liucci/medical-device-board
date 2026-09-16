import { API_BASE_URL } from "../../client/apiClient"

export async function getInspectionChecklistItemOptionsFromApi(
    checklistItemId: number
)
{
    console.log("fetchInspectionChecklistItemOptions")

    const response = await fetch(
        `${API_BASE_URL}/fetch-inspection-checklist-item-options/${checklistItemId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
    )

    return await response.json()
}