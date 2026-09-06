import {
    InspectionChecklist,
    InspectionChecklistDB,
    AddInspectionChecklistFrontType,
    UpdateInspectionChecklistFrontType,
    DeleteInspectionChecklistsFrontType
} from "../../types/inspectionTypes/inspectionChecklistTypes"


// DB → UI
export const normalizeInspectionChecklist = (
    checklist: InspectionChecklistDB
): InspectionChecklist => ({
    id: checklist.id,
    hospitalId: checklist.hospital_id,
    inspectionTypeId: checklist.inspection_type_id,
    deviceTypeId: checklist.device_type_id,
    deviceModelId: checklist.device_model_id,
    name: checklist.name,
    version: checklist.version,
    isActive: checklist.is_active,
    createdAt: checklist.created_at,
    updatedAt: checklist.updated_at
})


// Create
export const toAddInspectionChecklistRequest = (
    checklist: AddInspectionChecklistFrontType
) => ({
    inspection_type_id: checklist.inspectionTypeId,
    device_type_id: checklist.deviceTypeId,
    device_model_id: checklist.deviceModelId ?? null,
    name: checklist.name,
    version: checklist.version ?? 1
})


// Update
export const toUpdateInspectionChecklistRequest = (
    checklist: UpdateInspectionChecklistFrontType
) => ({
    id: checklist.id,
    inspection_type_id: checklist.inspectionTypeId,
    device_type_id: checklist.deviceTypeId,
    device_model_id: checklist.deviceModelId ?? null,
    name: checklist.name,
    version: checklist.version,
    is_active: checklist.isActive
})


// Delete
export const toDeleteInspectionChecklistsRequest = (
    checklists: DeleteInspectionChecklistsFrontType
) => ({
    ids: checklists.ids
})