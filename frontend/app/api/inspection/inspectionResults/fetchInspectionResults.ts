import { API_BASE_URL } from "../../client/apiClient"

export async function getInspectionResultsFromApi(
    inspectionId: number
)
{
    console.log("fetchInspectionResults")

    const response = await fetch(
        `${API_BASE_URL}/inspection-results/${inspectionId}`,
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