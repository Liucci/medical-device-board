from rooms.update_rooms import (
                                  update_room,
                                  update_room_patientname
                                )

from schemas.room_schemas import (
                                    UpdateRoomRequest,
                                    UpdateRoomPatientRequest
                                  )


def update_room_transaction(
                              room: UpdateRoomRequest,
                              hospital_id: str
                            ):

    print("update room transaction")
    return update_room(
                         room=room,
                         hospital_id=hospital_id
                       )


def update_room_patientname_transaction(
                                          room: UpdateRoomPatientRequest,
                                          hospital_id: str
                                        ):

    print("update room patientname transaction")

    return update_room_patientname(
                                     room=room,
                                     hospital_id=hospital_id
                                   )