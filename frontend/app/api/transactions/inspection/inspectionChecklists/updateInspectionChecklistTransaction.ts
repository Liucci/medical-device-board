import { API_BASE_URL } from "../../../client/apiClient"

import type {
    UpdateInspectionChecklist
} from "../../../../types/inspectionTypes/inspectionChecklistTypes"

import type {
    AddInspectionChecklistItem,
    UpdateInspectionChecklistItem
} from "../../../../types/inspectionTypes/inspectionChecklistItemTypes"


type UpdateInspectionChecklistTransactionParams = {
    inspectionChecklist: UpdateInspectionChecklist
    deleteItemIds: number[]
    updateItems: UpdateInspectionChecklistItem[]
    addItems: AddInspectionChecklistItem[]
}


export async function updateInspectionChecklistTransaction(
    params: UpdateInspectionChecklistTransactionParams
)
{
    console.log("updateInspectionChecklistTransaction")

    const response = await fetch(
        `${API_BASE_URL}/update-inspection-checklist`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                inspection_checklist: params.inspectionChecklist,
                delete_item_ids: params.deleteItemIds,
                update_items: params.updateItems,
                add_items: params.addItems,
            }),
        }
    )

    if (!response.ok) {
        throw new Error(
            "Failed to update inspection checklist"
        )
    }

    return await response.json()
}