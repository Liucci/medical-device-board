import {
    InspectionItemType,
    InspectionItemTypeDB,
    CreateInspectionItemType,
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
export const toCreateInspectionItemTypeRequest = (
    inspectionItemType: CreateInspectionItemType
) => ({
    name: inspectionItemType.name,
    description: inspectionItemType.description ?? null
})


// Update
export const toUpdateInspectionItemTypeRequest = (
    inspectionItemType: UpdateInspectionItemType
) => ({
    id: inspectionItemType.id,
    name: inspectionItemType.name,
    description: inspectionItemType.description ?? null,
    is_active: inspectionItemType.isActive
})


// Delete
export const toDeleteInspectionItemTypesRequest = (
    inspectionItemTypes: DeleteInspectionItemTypes
) => ({
    ids: inspectionItemTypes.ids
})