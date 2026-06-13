from common.supabase_client import (
    supabase
)


def fetch_device_types(hospital_id: str):
    print("fetch_device_types")
    response = (
            supabase
            .table("device_types")
            .select("*")
            .eq(
                "hospital_id",
                hospital_id
            )
            .execute()
        )
    return response.data
    

def fetch_device_type(
                        device_type_id: int,
                        hospital_id: str
                     ):

    print("fetch_device_type")

    response = (
                    supabase
                    .table("device_types")
                    .select("*")
                    .eq("id", device_type_id)
                    .eq("hospital_id", hospital_id)
                    .single()
                    .execute()
               )

    return response.data