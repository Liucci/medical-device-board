import { API_BASE_URL } from "../../client"
import { getRoomsFromApi } from "../../rooms/fetchRooms"

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

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  const response = await fetch(
                                 `${API_BASE_URL}/update-room-patientname`,
                                 {
                                   method: "POST",
                                   headers: {
                                               "Content-Type":"application/json",
                                               Authorization:`Bearer ${token}`
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