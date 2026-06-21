import { API_BASE_URL } from "../../client"
import { getRoomsFromApi } from "../../rooms/fetchRooms"
import { authFetch } from "../../client"
import {
         normalizeRoom,
         toUpdateRoomPatientRequest
       } from "../../../utils/roomsMapper"

import { UpdateRoomPatientType } from "../../../types/roomTypes"

type UpdateRoomPatientTransactionParams = {
                                             room: UpdateRoomPatientType
                                             setRooms: any
                                           }

export async function updateRoomPatientName({
                                               room,
                                               setRooms
                                             }: UpdateRoomPatientTransactionParams
                                           )
{
  console.log("updateRoomPatientName")

  const response = await authFetch(
                                 `${API_BASE_URL}/update-room-patientname`,
                                 {
                                   method: "POST",
                                   headers: {
                                              "Content-Type":
                                              "application/json"
                                             },
                                   body: JSON.stringify(
                                                           toUpdateRoomPatientRequest(
                                                                                         room
                                                                                       )
                                                         )
                                 }
                               )

  const rooms =
    await getRoomsFromApi()

  setRooms(
             rooms.map(
                        normalizeRoom
                      )
           )

  return await response.json()
}