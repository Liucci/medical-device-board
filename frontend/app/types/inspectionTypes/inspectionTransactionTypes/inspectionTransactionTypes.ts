// inspectionTransactionTypes.ts

import {
    AddInspectionFrontType,
    AddInspectionBackType
} from "../inspectionTypes"

import {
    AddInspectionResultFrontType,
    AddInspectionResultBackType
} from "../inspectionResultTypes"


// =========================
// Create Inspection Transaction
// =========================
//inspectionとinspectionResultの複合
export type CreateInspectionTransactionFrontType = {
    inspection: AddInspectionFrontType
    results: AddInspectionResultFrontType[]
}

export type CreateInspectionTransactionBackType = {
    inspection: AddInspectionBackType
    results: AddInspectionResultBackType[]
}


//InspectionListResponseをfrontで受け取る用の型定義
//inspection内の各idを基に、他tableから必要情報をかき集めたものをbackから受け取る用
export type InspectionListType = {
    id: number
    createdAt: string
    inspectionTypeName: string
    checklistName: string
    checklistId: number
    checklistVersion: number
    deviceTypeName: string
    deviceModelName: string
    managementNumber: string | null
    serialNumber: string | null
    wardName: string | null
    roomName: string | null
    patientName: string | null
    performedByName: string | null
    comment: string | null
    overallResult: string | null
}

export type InspectionListDBType = {
    id: number
    created_at: string
    inspection_type_name: string
    checklist_name: string
    checklist_id: number
    checklist_version: number
    device_type_name: string
    device_model_name: string
    management_number: string | null
    serial_number: string | null
    ward_name: string | null
    room_name: string | null
    patient_name: string | null
    performed_by_name: string | null
    comment: string | null
    overall_result: string | null
}
//result内のitem id,category idをもとに他tableから情報取得し加工しfrontに戻す用
export type InspectionResultDetailType = {
    categoryName: string
    categoryDisplayOrder: number
    itemName: string
    unit: string | null
    itemDisplayOrder: number
    value: string | null
}

export type InspectionResultDetailDBType = {
    category_name: string
    category_display_order: number
    item_name: string
    unit: string | null
    item_display_order: number
    value: string | null
}