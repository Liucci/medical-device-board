
import { API_BASE_URL } from "../../../client/apiClient"

export async function fetchInspectionList() {
    console.log("fetchInspectionList")

    const response = await fetch(
        `${API_BASE_URL}/inspection-list`,
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

