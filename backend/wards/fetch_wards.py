from supabase import Client
from schemas.ward_schemas import (WardResponse)
def fetch_wards(
          client:Client,
          hospital_id:str
          ):
    print("fetch_wards")
    response = (
                client
                .table("wards")
                .select("*")
                .eq(
                    "hospital_id",
                    hospital_id
                )
                .order("display_order")
                .execute()
    )
    return response.data

def fetch_ward(
                client:Client,
                ward_id: int,
                hospital_id: str
              ):

    print("fetch_ward")

    response = (
                    client
                    .table("wards")
                    .select("*")
                    .eq("id", ward_id)
                    .eq("hospital_id", hospital_id)
                    .order("display_order")
                    .single()
                    .execute()
               )

    return response.data

#並び替え用、display orderの最後の値を取り出す
def get_max_ward_display_order(
                            client:Client,
                            hospital_id: str
                        ) -> int:
        result = (
                client.
                table("wards")
                .select("display_order")
                .eq("hospital_id", hospital_id)
                .order("display_order", desc=True)
                .limit(1)
                .execute()
            )
        if not result.data:
            return 0

        return result.data[0]["display_order"]