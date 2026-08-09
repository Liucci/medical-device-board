from common.supabase_admin_client import (supabase)
from supabase import Client
from schemas.hospital_schemas import (UpdateHospitalRequest)
from datetime import datetime, timezone

def update_hospital(client:Client,
                    hospital: UpdateHospitalRequest):
    print("update_hospital")
    response = (
        client
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