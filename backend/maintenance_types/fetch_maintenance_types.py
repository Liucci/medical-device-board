from common.supabase_admin_client import (supabase)

def fetch_maintenance_types(hospital_id: str):
    print("fetch_maintenance_types")
    response = (
    supabase
    .table("maintenance_types")
    .select("*")
    .eq(
        "hospital_id",
        hospital_id
    )
    .execute()
)

    return response.data


def fetch_maintenance_type(
                             maintenance_type_id: int,
                             hospital_id: str
                          ):

    print("fetch_maintenance_type")

    response = (
                    supabase
                    .table("maintenance_types")
                    .select("*")
                    .eq("id", maintenance_type_id)
                    .eq("hospital_id", hospital_id)
                    .single()
                    .execute()
               )

    return response.data