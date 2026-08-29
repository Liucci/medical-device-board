import { API_BASE_URL } from "../../../client/apiClient"
import type {
    CreateInspectionChecklistTransactionBackType
} from "../../../../types/inspectionTypes/inspectionTransactionTypes/inspectionChecklistTransactionTypes"
type CreateInspectionChecklistTransactionParams = {
    request: CreateInspectionChecklistTransactionBackType
}

export async function createInspectionChecklistTransaction(
    params: CreateInspectionChecklistTransactionParams
) {
    console.log("createInspectionChecklistTransaction")
    const response = await fetch(
        `${API_BASE_URL}/create-inspection-checklist`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(params.request),
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