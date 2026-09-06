// inspectionTransactionMapper.ts

import {
    CreateInspectionTransactionFrontType,
    CreateInspectionTransactionBackType
} from "../../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"

import {
    toCreateInspectionRequest
} from "../inspectionMapper"

import {
    toCreateInspectionResultRequest
} from "../inspectionResultMapper"


export const toCreateInspectionTransactionRequest = (
    data: CreateInspectionTransactionFrontType
): CreateInspectionTransactionBackType => ({
    inspection: toCreateInspectionRequest(data.inspection),
    results: data.results.map(result =>
        toCreateInspectionResultRequest(result)
    )
})