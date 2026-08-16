import { API_BASE_URL } from "../../client/apiClient"
import type { UpdateInspectionType } from "../../../types/inspectionTypes/inspectionTypeTypes"

export async function updateInspectionTypeToApi(
    inspectionType: UpdateInspectionType
)
{
    console.log("updateInspectionType")

    const response = await fetch(
        `${API_BASE_URL}/inspection-types`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(inspectionType),
        }
    )

    return await response.json()
}