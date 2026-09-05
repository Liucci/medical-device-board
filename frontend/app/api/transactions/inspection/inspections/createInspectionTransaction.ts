import { API_BASE_URL } from "../../../client/apiClient"
import { CreateInspectionTransactionFrontType } from "../../../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"
import { toCreateInspectionTransactionRequest } from "../../../../utils/inspectionMapper/inspectionTransactionMapper/inspectionTransactionMapper"


type CreateInspectionTransactionParams = {
    inspection: CreateInspectionTransactionFrontType
    onClose?: () => void
}


export async function createInspectionTransaction({
    inspection,
    onClose
}: CreateInspectionTransactionParams)
{
    console.log("createInspectionTransaction")

    await fetch(
        `${API_BASE_URL}/create-inspection`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(
                toCreateInspectionTransactionRequest(
                    inspection
                )
            )
        }
    )



    if (onClose) {
        onClose()
    }
}