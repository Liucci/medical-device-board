import {
    Inspection,
    InspectionDB,
    CreateInspection,
    UpdateInspection,
    DeleteInspections
} from "../../types/inspectionTypes/inspectionTypes"


// DB → UI
export const normalizeInspection = (
    inspection: InspectionDB
): Inspection => ({
    id: inspection.id,
    hospitalId: inspection.hospital_id,
    deviceId: inspection.device_id,
    roomId: inspection.room_id,
    inspectionTypeId: inspection.inspection_type_id,
    checklistId: inspection.checklist_id,
    performedBy: inspection.performed_by,
    performedAt: inspection.performed_at,
    overallResult: inspection.overall_result,
    comment: inspection.comment,
    createdAt: inspection.created_at
})


// Create
export const toCreateInspectionRequest = (
    inspection: CreateInspection
) => ({
    device_id: inspection.deviceId,
    room_id: inspection.roomId ?? null,
    inspection_type_id: inspection.inspectionTypeId,
    checklist_id: inspection.checklistId,
    performed_at: inspection.performedAt,
    overall_result: inspection.overallResult ?? null,
    comment: inspection.comment ?? null
})


// Update
export const toUpdateInspectionRequest = (
    inspection: UpdateInspection
) => ({
    id: inspection.id,
    room_id: inspection.roomId ?? null,
    inspection_type_id: inspection.inspectionTypeId,
    checklist_id: inspection.checklistId,
    performed_at: inspection.performedAt,
    overall_result: inspection.overallResult ?? null,
    comment: inspection.comment ?? null
})


// Delete
export const toDeleteInspectionsRequest = (
    inspections: DeleteInspections
) => ({
    ids: inspections.ids
})