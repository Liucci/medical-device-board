from common.supabase_client import (supabase)
from schemas.ward_schemas import (UpdateWardRequest)


def update_ward(
                ward:UpdateWardRequest,
                hospital_id:str
                ):

    print(f"rename ward")

    response = (
                supabase
                .table("wards")
                .update({"name": ward.name,})
                .eq("id",ward.id)
                .eq("hospital_id", hospital_id)
                .execute()
                )
