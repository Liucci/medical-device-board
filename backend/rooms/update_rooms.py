from supabase import Client
from schemas.room_schemas import (
                                    UpdateRoomRequest,
                                    UpdateRoomPatientRequest,
                                    ClearRoomPatientRequest
                                  )

def update_room(
                  client:Client,
                  room: UpdateRoomRequest,
                  hospital_id: str
                ):

    print("update room")

    response = (
                    client
                    .table("rooms")
                    .update({"name": room.name})
                    .eq("id", room.id)
                    .eq("hospital_id", hospital_id)
                    .execute()
                )

    return response.data[0]

"front UIから患者名取得できる操作専用"
def update_room_patientname(
                              client:Client,
                              room: UpdateRoomPatientRequest,
                              hospital_id: str
                            ):

    print("update room patient name")

    response = (
                    client
                    .table("rooms")
                    .update({"patient_name": room.patient_name})
                    .eq("id", room.id)
                    .eq("hospital_id", hospital_id)
                    .execute()
                )

    return response.data[0]

"front UIから患者名取得できない操作だが、患者名を編集したいとき専用"
def clear_room_patientname(
                             client:Client,
                             room: ClearRoomPatientRequest,
                             hospital_id: str,
                             patient_name:str
                           ):

    print("clear_room_patientname")

    response = (
                  client
                  .table("rooms")
                  .update({
                              "patient_name": patient_name
                          })
                  .eq("id", room.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
               )

    return response.data[0]