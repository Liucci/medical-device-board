from common.supabase_client import (supabase)
from schemas.hospital_schemas import (UpdateHospitalRequest)
from datetime import datetime, timezone

def update_hospital(hospital: UpdateHospitalRequest):
    print("update_hospital")
    response = (
        supabase
        .table("hospitals")
        .update(
            {
                "hospital_name": hospital.hospital_name,
                "price_plan": hospital.price_plan,
                "is_active": hospital.is_active,
                "note": hospital.note,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        )
        .eq(
            "id",
            hospital.hospital_id
        )
        .execute()
    )

    return response.data[0]