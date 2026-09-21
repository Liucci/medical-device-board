import { API_BASE_URL } from "../../../client/apiClient"


//back側で取得件数指定してinspectionを取得するAPIを叩く用
export async function fetchInspectionsByLimit(
    deviceId: number,
    checklistId: number
) {
    console.log("fetchInspectionsByLimit")

    const response = await fetch(
        `${API_BASE_URL}/inspections/by-limit?device_id=${deviceId}&checklist_id=${checklistId}`,
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