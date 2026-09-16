import { API_BASE_URL } from "../../../client/apiClient"

export async function fetchInspectionResulttransaction(
    inspectionId: number,
    checklistId: number
) {
    console.log("fetchInspectionResultTransaction")

    const response = await fetch(
        `${API_BASE_URL}/inspection-result-detail/${inspectionId}?checklist_id=${checklistId}`,
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