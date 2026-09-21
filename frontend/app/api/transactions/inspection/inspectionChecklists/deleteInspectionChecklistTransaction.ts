import { API_BASE_URL } from "../../../client/apiClient"
import type { InspectionChecklist } from "../../../../types/inspectionTypes/inspectionChecklistTypes"
import { normalizeInspectionChecklist } from "../../../../mapper/inspectionMapper/inspectionChecklistMapper"
export async function deleteInspectionChecklistTransaction(
    params: {checklistId: number}
        ): Promise<InspectionChecklist[]>
{
    console.log("deleteInspectionChecklistTransaction")

    const response = await fetch(
        `${API_BASE_URL}/delete-inspection-checklist?checklist_id=${params.checklistId}`,
        {
            method: "DELETE",

            headers: {
                "Content-Type": "application/json",
            },

            credentials: "include",
        }
    )

    if (!response.ok) {
        const error = await response.json()

        console.error(
            "delete inspection checklist error:",
            JSON.stringify(error, null, 2)
        )

        throw new Error(
            "Failed to delete inspection checklist"
        )
    }
    const data = await response.json()
    return data.map(normalizeInspectionChecklist)
}