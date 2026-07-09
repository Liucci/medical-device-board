from common.supabase_client import (supabase)

from schemas.hospital_schemas import (AddHospitalRequest)


def add_hospital(hospital: AddHospitalRequest):
    print("add_hospital")
    response = (
        supabase
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