import type {
    CreateInspectionChecklistTransactionBackType
} from "../../../types/inspectionTypes/inspectionTransactionTypes/inspectionChecklistTransactionTypes"

import type {
    AddInspectionChecklistFrontType
} from "../../../types/inspectionTypes/inspectionChecklistTypes"

import type {
    AddInspectionChecklistItemFrontType
} from "../../../types/inspectionTypes/inspectionChecklistItemTypes"


export function toCreateInspectionChecklistTransactionRequest(
    inspectionChecklist: AddInspectionChecklistFrontType,
    items: AddInspectionChecklistItemFrontType[]
): CreateInspectionChecklistTransactionBackType[] {

    return items.map((item) => ({
        inspection_type_id: inspectionChecklist.inspectionTypeId,
        device_type_id: inspectionChecklist.deviceTypeId,
        device_model_id: inspectionChecklist.deviceModelId?? 1,
        name: inspectionChecklist.name,
        version: inspectionChecklist.version?? 1,

        display_order: item.displayOrder,
        item_name: item.itemName,
        item_type_id: item.itemTypeId,
        required: item.required,
        default_value: item.defaultValue ?? null,
        options: item.options ?? null,
        unit: item.unit ?? null,
    }))
}