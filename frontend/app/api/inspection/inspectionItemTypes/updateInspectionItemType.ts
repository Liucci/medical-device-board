import { API_BASE_URL } from "../../client/apiClient"
import type { UpdateInspectionItemBackType } from "../../../types/inspectionTypes/inspectionItemTypeTypes"

export async function updateInspectionItemTypeToApi(
    inspectionItemType: UpdateInspectionItemBackType
)
{
    console.log("updateInspectionItemType")

    const response = await fetch(
        `${API_BASE_URL}/inspection-item-types`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(inspectionItemType),
        }
    )

    return await response.json()
}