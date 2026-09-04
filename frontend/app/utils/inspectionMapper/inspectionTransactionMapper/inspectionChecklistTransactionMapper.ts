
import type {
    CreateInspectionChecklistNewVerTransactionFrontType,
    CreateInspectionChecklistNewVerTransactionBackType,
    CreateInspectionChecklistTransactionBackType,
    CreateInspectionChecklistTransactionFrontType
} from "../../../types/inspectionTypes/inspectionTransactionTypes/inspectionChecklistTransactionTypes"



export function toCreateInspectionChecklistTransactionRequest(
    data: CreateInspectionChecklistTransactionFrontType
): CreateInspectionChecklistTransactionBackType {
console.log(
    "CreateChecklist FrontType:",
    JSON.stringify(data, null, 2)
)
    return {
        inspection_type_id: data.inspectionTypeId,
        device_type_id: data.deviceTypeId,
        device_model_id: data.deviceModelId ?? null,
        name: data.name,
        version: data.version,

        items: data.items.map((item) => ({
            display_order: item.displayOrder,
            item_name: item.itemName,
            category_id: item.categoryId,
            item_type_id: item.itemTypeId,
            required: item.required,
            default_value: item.defaultValue ?? null,

            options: item.options?.map((option) => ({
                    value: option.value,
                    display_order: option.displayOrder,
            })) ?? null,  

            unit: item.unit ?? null,
        })),
    }
}

export function toCreateInspectionChecklistNewVerTransactionRequest(
    data: CreateInspectionChecklistNewVerTransactionFrontType
): CreateInspectionChecklistNewVerTransactionBackType {

    return {
        inspection_type_id: data.inspectionTypeId,
        device_type_id: data.deviceTypeId,
        device_model_id: data.deviceModelId ?? null,
        name: data.name,
        version: data.version,

        items: data.items.map((item) => ({
            display_order: item.displayOrder,
            item_name: item.itemName,
            category_id: item.categoryId,
            item_type_id: item.itemTypeId,
            required: item.required,
            default_value: item.defaultValue ?? null,

            options: item.options?.map((option) => ({
                    value: option.value,
                    display_order: option.displayOrder,
            })) ?? null,

            unit: item.unit ?? null,
        })),
    }
}