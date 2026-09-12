import type { InspectionListType } from "../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"

export function getInspectionIdsForCsv(
    inspections: InspectionListType[]
): number[] {

    console.log(
        "getInspectionIdsForCsv"
    )

    return inspections
        .map(inspection => inspection.id)
        .filter((id): id is number => id !== undefined)
}