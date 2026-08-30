import {
    InspectionType,
    InspectionTypeDB,
    CreateInspectionTypeFrontType,
    UpdateInspectionTypeFrontType,
} from "../../types/inspectionTypes/inspectionTypeTypes"


// DB → UI
export const normalizeInspectionType = (
    inspectionType: InspectionTypeDB
): InspectionType => ({
    id: inspectionType.id,
    hospitalId: inspectionType.hospital_id,
    name: inspectionType.name,
    isActive: inspectionType.is_active,
})

// Create
export const toCreateInspectionTypeRequest = (
    inspectionType: CreateInspectionTypeFrontType
) => ({
    name: inspectionType.name
})


// Update
export const toUpdateInspectionTypeRequest = (
    inspectionType: UpdateInspectionTypeFrontType
) => ({
    id: inspectionType.id,
    name: inspectionType.name,
    is_active: inspectionType.isActive
})


