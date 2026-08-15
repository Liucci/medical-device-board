import {
    InspectionType,
    InspectionTypeDB,
    CreateInspectionType,
    UpdateInspectionType,
    DeleteInspectionTypes
} from "../../types/inspectionTypes/inspectionTypeTypes"


// DB → UI
export const normalizeInspectionType = (
    inspectionType: InspectionTypeDB
): InspectionType => ({
    id: inspectionType.id,
    name: inspectionType.name,
    isActive: inspectionType.is_active
})


// Create
export const toCreateInspectionTypeRequest = (
    inspectionType: CreateInspectionType
) => ({
    name: inspectionType.name
})


// Update
export const toUpdateInspectionTypeRequest = (
    inspectionType: UpdateInspectionType
) => ({
    id: inspectionType.id,
    name: inspectionType.name,
    is_active: inspectionType.isActive
})


// Delete
export const toDeleteInspectionTypesRequest = (
    inspectionTypes: DeleteInspectionTypes
) => ({
    ids: inspectionTypes.ids
})