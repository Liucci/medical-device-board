import { API_BASE_URL } from "../../../client/apiClient"

import {
    InspectionType,
    UpdateInspectionTypeFrontType,
} from "../../../../types/inspectionTypes/inspectionTypeTypes"

import { getInspectionTypes} from "../../../inspection/inspectionTypes/fetchInspectionTypes"

import {
    normalizeInspectionType,
    toUpdateInspectionTypeRequest,
} from  "../../../../utils/inspectionMapper/inspectionTypeMapper"


type UpdateInspectionTypeTransactionParams = {
    inspectionType: UpdateInspectionTypeFrontType
    setInspectionTypes: React.Dispatch<
        React.SetStateAction<InspectionType[]>
    >
    onClose?: () => void
}


export async function updateInspectionTypeTransaction({
    inspectionType,
    setInspectionTypes,
    onClose,
}: UpdateInspectionTypeTransactionParams) {

    console.log("updateInspectionTypeTransaction")

    await fetch(
        `${API_BASE_URL}/update-inspection-type-transaction`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(
                toUpdateInspectionTypeRequest(
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