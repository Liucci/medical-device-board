from common.supabase_client import (
    supabase
)

def fetch_master(

    hospital_id: str
):

    types_response = (
        supabase
        .table("device_types")
        .select("*")
        .eq(
            "hospital_id",
            hospital_id
        )
        .execute()
    )

    models_response = (
        supabase
        .table("device_models")
        .select("*")
        .eq(
            "hospital_id",
            hospital_id
        )
        .execute()
    )

    return {

        "device_types":
        types_response.data,

        "device_models":
        models_response.data
    }