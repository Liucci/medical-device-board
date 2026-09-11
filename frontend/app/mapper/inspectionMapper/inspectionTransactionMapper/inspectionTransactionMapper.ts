// inspectionTransactionMapper.ts

import {
    CreateInspectionTransactionFrontType,
    CreateInspectionTransactionBackType
} from "../../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"

import {
    InspectionListType,
    InspectionListDBType
} from "../../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"

import {toCreateInspectionRequest} from "../inspectionMapper"
import {toCreateInspectionResultRequest} from "../inspectionResultMapper"
import {
    InspectionResultDetailDBType,InspectionResultDetailType
} from "../../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"

//点検結果を保存する用
//型定義内に別の型定義が内包するtypesをDB用に変換
export const toCreateInspectionTransactionRequest = (
    data: CreateInspectionTransactionFrontType
): CreateInspectionTransactionBackType => ({
    inspection: toCreateInspectionRequest(data.inspection),
    results: data.results.map(result =>
        toCreateInspectionResultRequest(result)
    )
})


//backから受け取った点検結果をUIに表示させるよう
export const normalizeInspectionList = (
    inspection: InspectionListDBType
): InspectionListType => ({
    id: inspection.id,
    createdAt: inspection.created_at,
    inspectionTypeName: inspection.inspection_type_name,
    checklistName: inspection.checklist_name,
    checklistId:inspection.checklist_id,
    checklistVersion:inspection.checklist_version,
    deviceTypeName: inspection.device_type_name,
    deviceModelName: inspection.device_model_name,
    managementNumber: inspection.management_number,
    serialNumber: inspection.serial_number,
    wardName: inspection.ward_name,
    roomName: inspection.room_name,
    patientName: inspection.patient_name,
    performedByName: inspection.performed_by_name,
    comment: inspection.comment,
    overallResult: inspection.overall_result
})


//resultをUI用に加工したものをbackから受け取りUI用に変換用（単一result用）
export const normalizeInspectionResultDetail = (
    data: InspectionResultDetailDBType
): InspectionResultDetailType => ({
    categoryName: data.category_name,
    categoryDisplayOrder: data.category_display_order,
    itemName: data.item_name,
    unit: data.unit,
    itemDisplayOrder: data.item_display_order,
    value: data.value,
})


//result 複数件用
export const normalizeInspectionResultDetails = (
    data: InspectionResultDetailDBType[]
): InspectionResultDetailType[] =>
    data.map(normalizeInspectionResultDetail)