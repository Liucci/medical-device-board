import {
    InspectionItemType,
    InspectionItemTypeDB,
    AddInspectionItemFrontType,
    AddInspectionItemBackType,
    UpdateInspectionItemFrontType,
    UpdateInspectionItemBackType,
    DeleteInspectionItemTypes
} from "../../types/inspectionTypes/inspectionItemTypeTypes"


// =========================
// DB → UI
// =========================

export const normalizeInspectionItemType = (
    inspectionItemType: InspectionItemTypeDB
): InspectionItemType => ({

    id: inspectionItemType.id,
    name: inspectionItemType.name,
    description: inspectionItemType.description,
    inputType: inspectionItemType.input_type,
    isCustomOption: inspectionItemType.is_custom_option,
    options: inspectionItemType.options,
    isActive: inspectionItemType.is_active

})


// =========================
// Create
// =========================

export const toAddInspectionItemTypeRequest = (
    inspectionItemType: AddInspectionItemFrontType
): AddInspectionItemBackType => ({

    name: inspectionItemType.name,
    description: inspectionItemType.description ?? null,
    input_type: inspectionItemType.inputType,
    is_custom_option: inspectionItemType.isCustomOption,
    options: inspectionItemType.options ?? null

})


// =========================
// Update
// =========================

export const toUpdateInspectionItemTypeRequest = (
    inspectionItemType: UpdateInspectionItemFrontType
): UpdateInspectionItemBackType => ({

    id: inspectionItemType.id,
    name: inspectionItemType.name,
    description: inspectionItemType.description ?? null,
    input_type: inspectionItemType.inputType,
    is_custom_option: inspectionItemType.isCustomOption,
    options: inspectionItemType.options ?? null,
    is_active: inspectionItemType.isActive

})


// =========================
// Delete
// =========================

export const toDeleteInspectionItemTypesRequest = (
    inspectionItemTypes: DeleteInspectionItemTypes
) => ({

    ids: inspectionItemTypes.ids

})