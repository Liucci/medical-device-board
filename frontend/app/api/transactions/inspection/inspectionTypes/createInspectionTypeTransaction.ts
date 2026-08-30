import { API_BASE_URL } from "../../../client/apiClient"

import { InspectionType,CreateInspectionTypeFrontType } from "../../../../types/inspectionTypes/inspectionTypeTypes"

import { getInspectionTypes } from "../../../inspection/inspectionTypes/fetchInspectionTypes"

import {
    normalizeInspectionType,
    toCreateInspectionTypeRequest,
} from "../../../../utils/inspectionMapper/inspectionTypeMapper"


type CreateInspectionTypeTransactionParams = {
    inspectionType: CreateInspectionTypeFrontType
    setInspectionTypes: React.Dispatch<
        React.SetStateAction<InspectionType[]>
    >
    onClose?: () => void
}


export async function createInspectionTypeTransaction({
    inspectionType,
    setInspectionTypes,
    onClose,
}: CreateInspectionTypeTransactionParams) {

    console.log("createInspectionTypeTransaction")

    await fetch(
        `${API_BASE_URL}/create-inspection-type-transaction`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(
                toCreateInspectionTypeRequest(
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