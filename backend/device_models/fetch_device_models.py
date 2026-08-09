from common.supabase_admin_client import (supabase)
from supabase import Client

def fetch_device_models( client:Client,
                        hospital_id: str):
    print("fetch_device_models")
    response = (
            client
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
                          client:Client,
                          device_model_id: int,
                         hospital_id: str
                      ):

    print("fetch_device_model")

    response = (
                    client
                    .table("device_models")
                    .select("*")
                    .eq("id", device_model_id)
                    .eq("hospital_id", hospital_id)
                    .single()
                    .execute()
               )

    return response.data