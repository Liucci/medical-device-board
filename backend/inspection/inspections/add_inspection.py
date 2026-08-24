from supabase import Client
from schemas.inspection_schemas.inspection_schemas import (
    AddInspectionRequest
)


def add_inspection(
    client: Client,
    inspection: AddInspectionRequest,
    hospital_id: str,
    performed_by: str | None = None
):
    print("add_inspection")

    response = (
        client
        .table("inspections")
        .insert({
            "hospital_id": hospital_id,
            "device_id": inspection.device_id,
            "room_id": inspection.room_id,
            "inspection_type_id": inspection.inspection_type_id,
            "checklist_id": inspection.checklist_id,
            "performed_by": performed_by,
            "performed_at": inspection.performed_at,
            "overall_result": inspection.overall_result,
            "comment": inspection.comment
        })
        .execute()
    )

    return response.data[0]