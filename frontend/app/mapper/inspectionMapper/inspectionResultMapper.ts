// inspectionResultMapper.ts

import {
    InspectionResult,
    InspectionResultDB,
    AddInspectionResultFrontType,
    AddInspectionResultBackType,
    UpdateInspectionResultFrontType,
    UpdateInspectionResultBackType,
    DeleteInspectionResults
} from "../../types/inspectionTypes/inspectionResultTypes"


// DB → UI
export const normalizeInspectionResult = (
    result: InspectionResultDB
): InspectionResult => ({
    id: result.id,
    inspectionId: result.inspection_id,
    categoryName: result.category_name,
    categoryDisplayOrder: result.category_display_order,
    itemName: result.item_name,
    itemDisplayOrder: result.item_display_order,
    unit: result.unit,
    value: result.value
})


// Create

export const toCreateInspectionResultRequest = (
    result: AddInspectionResultFrontType
): AddInspectionResultBackType => ({
    checklist_item_id: result.checklistItemId,
    value: result.value ?? null
})


// Update

export const toUpdateInspectionResultRequest = (
    result: UpdateInspectionResultFrontType
): UpdateInspectionResultBackType => ({
    id: result.id,
    value: result.value ?? null
})


// Delete

export const toDeleteInspectionResultsRequest = (
    results: DeleteInspectionResults
) => ({
    ids: results.ids
})