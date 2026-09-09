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
    deviceTypeName: inspection.device_type_name,
    deviceModelName: inspection.device_model_name,
    managementNumber: inspection.management_number,
    serialNumber: inspection.serial_number,
    wardName: inspection.ward_name,
    roomName: inspection.room_name,
    patientName: inspection.patient_name,
    inspectionTypeName: inspection.inspection_type_name,
    checklistName: inspection.checklist_name,
    performedByName: inspection.performed_by_name,
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