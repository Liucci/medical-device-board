import { API_BASE_URL } from "../../../client/apiClient"

import type {
    AddInspectionChecklist
} from "../../../../types/inspectionTypes/inspectionChecklistTypes"

import type {
    AddInspectionChecklistItem
} from "../../../../types/inspectionTypes/inspectionChecklistItemTypes"

import {
    toAddInspectionChecklistRequest
} from "../../../../utils/inspectionMapper/inspectionChecklistMapper"


type AddInspectionChecklistTransactionParams = {
    inspectionChecklist: AddInspectionChecklist
    items: AddInspectionChecklistItem[]
}


export async function createInspectionChecklistTransaction(
    params: AddInspectionChecklistTransactionParams
)
{
    console.log("createInspectionChecklistTransaction")

    const response = await fetch(
        `${API_BASE_URL}/create-inspection-checklist`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
                inspection_checklist:
                    toAddInspectionChecklistRequest(
                        params.inspectionChecklist
                    ),

                items: params.items.map((item) => ({
                    item_name: item.itemName,
                    item_type_id: item.itemTypeId,
                    display_order: item.displayOrder,
                    required: item.required,
                    default_value: item.defaultValue ?? null,
                    options: item.options ?? null,
                    unit: item.unit ?? null,
                })),
            }),
        }
    )

    if (!response.ok) {

        const error = await response.json()

        console.error(
            "create inspection checklist error:",
            JSON.stringify(error, null, 2)
        )

        throw new Error(
            "Failed to create inspection checklist"
        )
    }

    return await response.json()
}