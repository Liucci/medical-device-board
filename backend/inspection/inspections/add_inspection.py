from supabase import Client

from schemas.inspection_schemas.transaction_schemas.inspection_transaction_schemas import (
    AddInspectionSnapshotRequest
)


def add_inspection(
    client: Client,
    inspection: AddInspectionSnapshotRequest,
    hospital_id: str,
    performed_by_name: str | None = None
):
    print("add_inspection")

    response = (
        client
        .table("inspections")
        .insert({
            "hospital_id": hospital_id,
            "device_type_name": inspection.device_type_name,
            "device_model_name": inspection.device_model_name,
            "management_number": inspection.management_number,
            "serial_number": inspection.serial_number,
            "ward_name": inspection.ward_name,
            "room_name": inspection.room_name,
            "patient_name": inspection.patient_name,
            "inspection_type_name": inspection.inspection_type_name,
            "checklist_name": inspection.checklist_name,
            "checklist_id":inspection.checklist_id,
            "checklist_version":inspection.checklist_version,
            "performed_by_name": performed_by_name,
            "overall_result": inspection.overall_result,
            "comment": inspection.comment
        })
        .execute()
    )

    return response.data[0]