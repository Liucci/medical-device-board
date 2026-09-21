import { API_BASE_URL } from "../../../client/apiClient"

import {
    InspectionType,
    DeleteInspectionTypeFrontType,
} from "../../../../types/inspectionTypes/inspectionTypeTypes"

import { getInspectionTypes } from "../../../inspection/inspectionTypes/fetchInspectionTypes"

import {
    normalizeInspectionType,
    toDeleteInspectionTypeRequest,
} from "../../../../mapper/inspectionMapper/inspectionTypeMapper"


type DeleteInspectionTypeTransactionParams = {
    inspectionType: DeleteInspectionTypeFrontType
    setInspectionTypes: React.Dispatch<
        React.SetStateAction<InspectionType[]>
    >
    onClose?: () => void
}


export async function deleteInspectionTypeTransaction({
    inspectionType,
    setInspectionTypes,
    onClose,
}: DeleteInspectionTypeTransactionParams) {

    console.log("deleteInspectionTypeTransaction")

    await fetch(
        `${API_BASE_URL}/delete-inspection-type`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(
                toDeleteInspectionTypeRequest(
                    inspectionType
                )
            ),
        }
    )

    const inspectionTypes =
        await getInspectionTypes()

    setInspectionTypes(
        inspectionTypes.map(
            normalizeInspectionType
        )
    )

    if (onClose) {
        onClose()
    }
}