import { API_BASE_URL } from "../../client/apiClient"
import type { DeleteInspectionTypes } from "../../../types/inspectionTypes/inspectionTypeTypes"

export async function deleteInspectionTypesFromApi(
    inspectionTypes: DeleteInspectionTypes
)
{
    console.log("deleteInspectionTypes")

    const response = await fetch(
        `${API_BASE_URL}/inspection-types`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(inspectionTypes),
        }
    )

    return await response.json()
}