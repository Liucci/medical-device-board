import { API_BASE_URL } from "../../../client/apiClient"

import type {
    DeleteInspectionChecklists
} from "../../../../types/inspectionTypes/inspectionChecklistTypes"


export async function deleteInspectionChecklistTransaction(
    inspectionChecklists: DeleteInspectionChecklists
)
{
    console.log("deleteInspectionChecklistTransaction")

    const response = await fetch(
        `${API_BASE_URL}/delete-inspection-checklist`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(inspectionChecklists),
        }
    )

    if (!response.ok) {
        throw new Error(
            "Failed to delete inspection checklist"
        )
    }

    return await response.json()
}