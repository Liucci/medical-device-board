from supabase import Client
from schemas.room_schemas import (DeleteRoomsRequest)
from schemas.ward_schemas import (DeleteWardRequest)



#直接roomを消す場合
def delete_rooms(
                client:Client,
                room:DeleteRoomsRequest,
                hospital_id:str
                ):
    print("delete room")
    (
            client
            .table("rooms")
            .delete()
            .in_("id",room.ids)
            .eq("hospital_id",hospital_id)
            .execute()
        )
   






#ward削除によって紐づいているroomが削除される場合
def delete_rooms_by_ward_id(
                            client:Client,
                            ward:DeleteWardRequest,
                            hospital_id: str
                             ):

    print("delete rooms by ward ids")

    (
        client
        .table("rooms")
        .delete()
        .eq("ward_id", ward.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )