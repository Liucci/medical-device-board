import type {InspectionChecklistItemOption,
    InspectionChecklistItemOptionFrontType,
    InspectionChecklistItemOptionBackType,
} from "../../types/inspectionTypes/inspectionChecklistItemOptionTypes"


// =========================
// DB → UI
// =========================

export const normalizeInspectionChecklistItemOption = (
    option: InspectionChecklistItemOptionBackType
): InspectionChecklistItemOptionFrontType => {
    return {
        id: option.id,
        checklistItemId: option.checklist_item_id,
        value: option.value,
        displayOrder: option.display_order,
    }
}

export const normalizeInspectionChecklistItemOptionForItem = (
    option: InspectionChecklistItemOptionBackType
): InspectionChecklistItemOption => ({
    value: option.value,
    displayOrder: option.display_order
})