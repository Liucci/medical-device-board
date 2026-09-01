import { API_BASE_URL } from "../../../client/apiClient"
import type {CreateInspectionChecklistTransactionFrontType} from "../../../../types/inspectionTypes/inspectionTransactionTypes/inspectionChecklistTransactionTypes"
import {
    toCreateInspectionChecklistTransactionRequest
} from "../../../../utils/inspectionMapper/inspectionTransactionMapper/inspectionChecklistTransactionMapper"


export async function createInspectionChecklistTransaction(
    params: {
        request: CreateInspectionChecklistTransactionFrontType
    }) 
    {
    console.log("createInspectionChecklistTransaction")
   const request =
        toCreateInspectionChecklistTransactionRequest(
            params.request
        )
    const response = await fetch(
        `${API_BASE_URL}/create-inspection-checklist`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            credentials: "include",
            body: JSON.stringify(request),           
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