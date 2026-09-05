// inspectionTransactionTypes.ts

import {
    AddInspectionFrontType,
    AddInspectionBackType
} from "../inspectionTypes"

import {
    AddInspectionResultFrontType,
    AddInspectionResultBackType
} from "../inspectionResultTypes"


// =========================
// Create Inspection Transaction
// =========================
//inspectionとinspectionResultの複合
export type CreateInspectionTransactionFrontType = {
    inspection: AddInspectionFrontType
    results: AddInspectionResultFrontType[]
}

export type CreateInspectionTransactionBackType = {
    inspection: AddInspectionBackType
    results: AddInspectionResultBackType[]
}