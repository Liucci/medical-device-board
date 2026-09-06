import {
    Inspection,
    InspectionDB,
    AddInspectionFrontType,
    AddInspectionBackType,
    UpdateInspectionFrontType,
    UpdateInspectionBackType,
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
    overallResult: inspection.overall_result,
    comment: inspection.comment,
    createdAt: inspection.created_at
})


// Create

export const toCreateInspectionRequest = (
    inspection: AddInspectionFrontType
): AddInspectionBackType => ({
    device_id: inspection.deviceId,
    room_id: inspection.roomId ?? null,
    inspection_type_id: inspection.inspectionTypeId,
    checklist_id: inspection.checklistId,
    overall_result: inspection.overallResult ?? null,
    comment: inspection.comment ?? null
})


// Update

export const toUpdateInspectionRequest = (
    inspection: UpdateInspectionFrontType
): UpdateInspectionBackType => ({
    id: inspection.id,
    room_id: inspection.roomId,
    inspection_type_id: inspection.inspectionTypeId,
    checklist_id: inspection.checklistId,
    overall_result: inspection.overallResult,
    comment: inspection.comment
})