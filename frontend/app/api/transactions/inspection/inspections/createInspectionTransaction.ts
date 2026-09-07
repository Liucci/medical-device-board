import { API_BASE_URL } from "../../../client/apiClient"
import { CreateInspectionTransactionFrontType } from "../../../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"
import { toCreateInspectionTransactionRequest } from "../../../../mapper/inspectionMapper/inspectionTransactionMapper/inspectionTransactionMapper"


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
    const request = toCreateInspectionTransactionRequest(inspection)
    //console.log( "型変換後の点検結果:",JSON.stringify(request, null, 2))

    
    await fetch(
        `${API_BASE_URL}/create-inspection`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(request)           
            
        }
    )



    if (onClose) {
        onClose()
    }
}