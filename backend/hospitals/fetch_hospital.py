import os
from common.supabase_admin_client import (supabase)

#単一病院取得
def fetch_hospital(
                    hospital_id:str
                  ):
    print("fetch_hospital")
    response = (
                    supabase
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
def fetch_hospitals():

    print("fetch_hospitals")

    response = (
        supabase
        .table("hospitals")
        .select("*")
        .order(
            "created_at",
            desc=True
        )
        .execute()
    )

    return response.data