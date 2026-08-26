import {
    InspectionResult,
    InspectionResultDB,
    AddInspectionResult,
    UpdateInspectionResult,
    DeleteInspectionResults
} from "../../types/inspectionTypes/inspectionResultTypes"


// DB → UI
export const normalizeInspectionResult = (
    result: InspectionResultDB
): InspectionResult => ({
    id: result.id,
    inspectionId: result.inspection_id,
    checklistItemId: result.checklist_item_id,
    value: result.value
})


// Create
export const toCreateInspectionResultRequest = (
    result: AddInspectionResult
) => ({
    checklist_item_id: result.checklistItemId,
    value: result.value ?? null
})


// Update
export const toUpdateInspectionResultRequest = (
    result: UpdateInspectionResult
) => ({
    id: result.id,
    value: result.value ?? null
})


// Delete
export const toDeleteInspectionResultsRequest = (
    results: DeleteInspectionResults
) => ({
    ids: results.ids
})