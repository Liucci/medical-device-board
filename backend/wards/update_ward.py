from supabase import Client
from schemas.ward_schemas import (UpdateWardRequest,UpdateWardOrderRequest,UpdateWardInfoRequest)

#名前更新用
def update_ward(
                client:Client,
                ward:UpdateWardRequest,
                hospital_id:str
                ):
    print("update_ward")

    (
                client
                .table("wards")
                .update({"name": ward.name,})
                .eq("id",ward.id)
                .eq("hospital_id", hospital_id)
                .execute()
                )


#並び順更新用
def update_ward_display_order(
                                client:Client,
                                ward:UpdateWardOrderRequest,
                                hospital_id:str
                            ):
    print("update_ward_display_order")
    (
        client
        .table("wards")
        .update({
            "display_order": ward.display_order
        })
        .eq("id", ward.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )


#ward info modal専用CRUD
def update_ward_info(
                    client:Client,
                    ward: UpdateWardInfoRequest,
                    hospital_id: str
):
    (
        client
        .table("wards")
        .update({
            "status": ward.status,
            "note": ward.note,
        })
        .eq("id", ward.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )