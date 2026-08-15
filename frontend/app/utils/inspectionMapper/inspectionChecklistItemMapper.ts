import {
    InspectionChecklistItem,
    InspectionChecklistItemDB,
    CreateInspectionChecklistItem,
    UpdateInspectionChecklistItem,
    DeleteInspectionChecklistItems,
    UpdateInspectionChecklistItemOrders
} from "../../types/inspectionTypes/inspectionChecklistItemTypes"


// DB → UI
export const normalizeInspectionChecklistItem = (
    item: InspectionChecklistItemDB
): InspectionChecklistItem => ({
    id: item.id,
    checklistId: item.checklist_id,
    displayOrder: item.display_order,
    itemName: item.item_name,
    itemTypeId: item.item_type_id,
    required: item.required,
    defaultValue: item.default_value,
    options: item.options,
    unit: item.unit
})


// Create
export const toCreateInspectionChecklistItemRequest = (
    item: CreateInspectionChecklistItem
) => ({
    checklist_id: item.checklistId,
    item_name: item.itemName,
    item_type_id: item.itemTypeId,
    required: item.required,
    default_value: item.defaultValue ?? null,
    options: item.options ?? null,
    unit: item.unit ?? null
})


// Update
export const toUpdateInspectionChecklistItemRequest = (
    item: UpdateInspectionChecklistItem
) => ({
    id: item.id,
    item_name: item.itemName,
    item_type_id: item.itemTypeId,
    required: item.required,
    default_value: item.defaultValue ?? null,
    options: item.options ?? null,
    unit: item.unit ?? null
})


// Delete
export const toDeleteInspectionChecklistItemsRequest = (
    items: DeleteInspectionChecklistItems
) => ({
    ids: items.ids
})


// Update Order
export const toUpdateInspectionChecklistItemOrdersRequest = (
    items: UpdateInspectionChecklistItemOrders
) => ({
    items: items.items.map((item) => ({
        id: item.id,
        display_order: item.displayOrder
    }))
})