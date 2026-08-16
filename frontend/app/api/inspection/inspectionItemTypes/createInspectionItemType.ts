import { API_BASE_URL } from "../../client/apiClient"
import type { CreateInspectionItemType } from "../../../types/inspectionTypes/inspectionItemTypeTypes"

export async function createInspectionItemTypeToApi(
    inspectionItemType: CreateInspectionItemType
)
{
    console.log("createInspectionItemType")

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