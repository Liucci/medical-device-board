from common.supabase_client import (supabase)

def fetch_device_models(hospital_id: str):
    print("fetch_device_models")
    response = (
            supabase
            .table("device_models")
            .select("*")
            .eq(
                "hospital_id",
                hospital_id
            )
            .execute()
        )
    return response.data


def fetch_device_model(
                         device_model_id: int,
                         hospital_id: str
                      ):

    print("fetch_device_model")

    response = (
                    supabase
                    .table("device_models")
                    .select("*")
                    .eq("id", device_model_id)
                    .eq("hospital_id", hospital_id)
                    .single()
                    .execute()
               )

    return response.data