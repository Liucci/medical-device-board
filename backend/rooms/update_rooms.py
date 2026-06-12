from common.supabase_client import supabase
from schemas.room_schemas import (
                                    UpdateRoomRequest,
                                    UpdateRoomPatientRequest,
                                    ClearRoomPatientRequest
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

"front UIから患者名取得できる操作専用"
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

"front UIから患者名取得できない操作だが、患者名を編集したいとき専用"
def clear_room_patientname(
                             room: ClearRoomPatientRequest,
                             hospital_id: str,
                             patient_name:str
                           ):

    print("clear_room_patientname")

    response = (
                  supabase
                  .table("rooms")
                  .update({
                              "patient_name": patient_name
                          })
                  .eq("id", room.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
               )

    return response.data[0]