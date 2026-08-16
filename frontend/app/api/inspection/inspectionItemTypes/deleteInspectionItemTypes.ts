import { API_BASE_URL } from "../../client/apiClient"
import type { DeleteInspectionItemTypes } from "../../../types/inspectionTypes/inspectionItemTypeTypes"

export async function deleteInspectionItemTypesFromApi(
    inspectionItemTypes: DeleteInspectionItemTypes
)
{
    console.log("deleteInspectionItemTypes")

    const response = await fetch(
        `${API_BASE_URL}/inspection-item-types`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(inspectionItemTypes),
        }
    )

    return await response.json()
}