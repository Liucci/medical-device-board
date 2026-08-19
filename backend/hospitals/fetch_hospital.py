import os
from common.supabase_admin_client import (supabase)
from supabase import Client

#単一病院取得
def fetch_hospital(
                    client:Client,
                    hospital_id:str
                  ):
    print("fetch_hospital")
    response = (
                    client
                    .table("hospitals")
                    .select("*")
                    .eq(
                        "id",
                        hospital_id
                    )
                    
                    .execute()
               )


    return response.data[0]


#全病院取得
def fetch_hospitals(client:Client,):

    print("fetch_hospitals")

    response = (
        client
        .table("hospitals")
        .select("*")
        .order(
            "created_at",
            desc=True
        )
        .execute()
    )

    return response.data