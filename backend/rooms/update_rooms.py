from common.supabase_client import supabase
from schemas.room_schemas import (
                                    UpdateRoomRequest,
                                    UpdateRoomPatientRequest
                                  )

def update_room(
                  room: UpdateRoomRequest,
                  hospital_id: str
                ):

    print("update room")

    response = (
                    supabase
                    .table("rooms")
                    .update({"name": room.name})
                    .eq("id", room.id)
                    .eq("hospital_id", hospital_id)
                    .execute()
                )

    return response.data[0]


def update_room_patientname(
                              room: UpdateRoomPatientRequest,
                              hospital_id: str
                            ):

    print("update room patient name")

    response = (
                    supabase
                    .table("rooms")
                    .update({"patient_name": room.patient_name})
                    .eq("id", room.id)
                    .eq("hospital_id", hospital_id)
                    .execute()
                )

    return response.data[0]