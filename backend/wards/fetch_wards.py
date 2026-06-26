from common.supabase_client import (supabase)
from schemas.ward_schemas import (WardResponse)
def fetch_wards(hospital_id:str):
    print("fetch_wards")
    response = (
                supabase
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
                ward_id: int,
                hospital_id: str
              ):

    print("fetch_ward")

    response = (
                    supabase
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
                            hospital_id: str
                        ) -> int:
        result = (
                supabase.table("wards")
                .select("display_order")
                .eq("hospital_id", hospital_id)
                .order("display_order", desc=True)
                .limit(1)
                .execute()
            )
        if not result.data:
            return 0

        return result.data[0]["display_order"]