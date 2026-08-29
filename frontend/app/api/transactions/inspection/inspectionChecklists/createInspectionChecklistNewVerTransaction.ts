import { API_BASE_URL } from "../../../client/apiClient"

import type {
    CreateInspectionChecklistNewVerTransactionFrontType
} from "../../../../types/inspectionTypes/inspectionTransactionTypes/inspectionChecklistTransactionTypes"

import {
    toCreateInspectionChecklistNewVerTransactionRequest
} from "../../../../utils/inspectionMapper/inspectionTransactionMapper/inspectionChecklistTransactionMapper"


export async function createInspectionChecklistNewVerTransaction(
    data: CreateInspectionChecklistNewVerTransactionFrontType
) {

    console.log("createInspectionChecklistNewVerTransaction")

    const requestBody =
        toCreateInspectionChecklistNewVerTransactionRequest(data)

    const response = await fetch(
        `${API_BASE_URL}/create-inspection-checklist-new-ver`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(requestBody),
        }
    )

    if (!response.ok) {
        const errorText = await response.text()

        console.error(
            "create inspection checklist new version error:",
            response.status,
            errorText
        )

        throw new Error(
            "Failed to create inspection checklist new version"
        )
    }

    return await response.json()
}