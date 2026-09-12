import type { InspectionListType } from "../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"

export function getInspectionIdsForPdf(
    inspections: InspectionListType[]
): number[] {

    console.log("getInspectionIdsForPdf")

    return inspections
        .map(inspection => inspection.id)
        .filter((id): id is number => id !== undefined)
}