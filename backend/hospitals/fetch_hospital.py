import os
from common.supabase_client import (supabase)


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