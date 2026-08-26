import { API_BASE_URL } from "../../client/apiClient"
import type { AddInspectionItemType } from "../../../types/inspectionTypes/inspectionItemTypeTypes"

export async function createInspectionItemTypeToApi(
    inspectionItemType: AddInspectionItemType
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