import { API_BASE_URL } from "../../client/apiClient"
import type { AddInspectionItemBackType } from "../../../types/inspectionTypes/inspectionItemTypeTypes"

export async function createInspectionItemTypeToApi(
    inspectionItemType: AddInspectionItemBackType
)
{
    console.log("addInspectionItemType")

    const response = await fetch(
        `${API_BASE_URL}/inspection-item-types`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(inspectionItemType),
        }
    )

    return await response.json()
}