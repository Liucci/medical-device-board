import { API_BASE_URL } from "../../client/apiClient"


//itemに紐づいているoptiosも同時に取得できるAPIを叩く
export const getInspectionChecklistItemsWithOptionsFromApi = async (
    checklistId: number
) => {
    const response = await fetch(
        `${API_BASE_URL}/inspection-checklist-items-with-options/${checklistId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
    )

    if (!response.ok) {
        throw new Error(
            `Failed to fetch inspection checklist items with options: ${response.status}`
        )
    }

    const data = await response.json()

    return data
}