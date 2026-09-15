import { API_BASE_URL } from "../../client/apiClient"
import type {
    CreateInspectionPdfFrontType
} from "../../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"
import {
    toCreateInspectionPdfRequest
} from "../../../mapper/inspectionMapper/inspectionTransactionMapper/inspectionTransactionMapper"

export async function createInspectionPdfTransaction(
data: CreateInspectionPdfFrontType)
 {
    console.log("createInspectionPdfTransaction")
    const request =toCreateInspectionPdfRequest(data)
    const response = await fetch(
        `${API_BASE_URL}/create-inspection-pdf`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            credentials: "include",
            body: JSON.stringify(
                                request,
            ),
        }
    )

    if (!response.ok) {
        const errorText =await response.text()
        console.error(
                        "createInspectionPdfTransaction error:",
                        response.status,
                        errorText
        )
        throw new Error(`PDF creation failed: ${response.status}`)
    }
    const blob = await response.blob()
    console.log("Backendから受信:",blob)
    return blob
}