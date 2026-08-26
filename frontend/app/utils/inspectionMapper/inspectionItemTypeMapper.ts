import {
    InspectionItemType,
    InspectionItemTypeDB,
    AddInspectionItemType,
    UpdateInspectionItemType,
    DeleteInspectionItemTypes
} from "../../types/inspectionTypes/inspectionItemTypeTypes"


// DB → UI
export const normalizeInspectionItemType = (
    inspectionItemType: InspectionItemTypeDB
): InspectionItemType => ({
    id: inspectionItemType.id,
    name: inspectionItemType.name,
    description: inspectionItemType.description,
    isActive: inspectionItemType.is_active
})


// Create
export const toAddInspectionItemTypeRequest = (
    inspectionItemType: AddInspectionItemType
) => ({
    name: inspectionItemType.name,
    description: inspectionItemType.description ?? null
})


// Update
export const toUpdateInspectionItemTypeRequest = (
    inspectionItemType: UpdateInspectionItemType
) => ({
    id: inspectionItemType.id,
    name: inspectionItemType.name?? null,
    description: inspectionItemType.description ?? null,
    is_active: inspectionItemType.isActive?? null,
})


// Delete
export const toDeleteInspectionItemTypesRequest = (
    inspectionItemTypes: DeleteInspectionItemTypes
) => ({
    ids: inspectionItemTypes.ids
})