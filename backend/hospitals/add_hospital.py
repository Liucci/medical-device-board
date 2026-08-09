from common.supabase_admin_client import (supabase)
from supabase import Client

from schemas.hospital_schemas import (AddHospitalRequest)


def add_hospital(client:Client,
                 hospital: AddHospitalRequest):
    print("add_hospital")
    response = (
        client
        .table("hospitals")
        .insert(
            {
                "hospital_name": hospital.hospital_name,
                "price_plan": hospital.price_plan,
                "note": hospital.note,
                "is_active": True
            }
        )
        .execute()
    )

    return response.data[0]