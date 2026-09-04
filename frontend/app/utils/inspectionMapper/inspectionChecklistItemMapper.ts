import {
    InspectionChecklistItem,
    InspectionChecklistItemDB,
    AddInspectionChecklistItemFrontType,
    UpdateInspectionChecklistItemFrontType,
    DeleteInspectionChecklistItemsFrontType,
} from "../../types/inspectionTypes/inspectionChecklistItemTypes"
import {normalizeInspectionChecklistItemOptionForItem} from "../../utils/inspectionMapper/inspectionChecklistItemOptionMapper"

// DB → UI
export const normalizeInspectionChecklistItem = (
    item: InspectionChecklistItemDB
): InspectionChecklistItem => ({
    id: item.id,
    checklistId: item.checklist_id,
    displayOrder: item.display_order,
    itemName: item.item_name,
    categoryId: item.category_id,
    itemTypeId: item.item_type_id,
    required: item.required,
    defaultValue: item.default_value,
    options: item.options
        ? item.options.map(normalizeInspectionChecklistItemOptionForItem)
        : null,
    unit: item.unit
})


// Create
export const toAddInspectionChecklistItemRequest = (
    item: AddInspectionChecklistItemFrontType
) => ({
    //checklist_id: item.checklistId,
    display_order: item.displayOrder,
    item_name: item.itemName,
    category_id: item.categoryId,
    item_type_id: item.itemTypeId,
    required: item.required,
    default_value: item.defaultValue ?? null,
    options: item.options ?? null,
    unit: item.unit ?? null
})


// Update
export const toUpdateInspectionChecklistItemRequest = (
    item: UpdateInspectionChecklistItemFrontType
) => ({
    id: item.id,
    display_order:item.displayOrder,
    item_name: item.itemName,
    category_id: item.categoryId,
    item_type_id: item.itemTypeId,
    required: item.required,
    default_value: item.defaultValue ?? null,
    options: item.options ?? null,
    unit: item.unit ?? null
})


// Delete
export const toDeleteInspectionChecklistItemsRequest = (
    items: DeleteInspectionChecklistItemsFrontType
) => ({
    ids: items.ids
})


