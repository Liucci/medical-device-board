import { API_BASE_URL } from "../../client"
import { UpdateRoomType } from "../../../types/roomTypes"
import { getRoomsFromApi } from "../../rooms/fetchRooms"

import {
         normalizeRoom,
         toUpdateRoomRequest
       } from "../../../utils/roomsMapper"

type UpdateRoomTransactionParams = {
                                     room: UpdateRoomType
                                     setRooms: any
                                   }

export async function updateRoomTransaction({
                                               room,
                                               setRooms
                                             }: UpdateRoomTransactionParams
                                           )
{
  console.log("updateRoomTransaction")

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  const response = await fetch(
                                 `${API_BASE_URL}/update-room`,
                                 {
                                   method: "POST",
                                   headers: {
                                               "Content-Type":"application/json",
                                               Authorization:`Bearer ${token}`
                                             },
                                   body: JSON.stringify(
                                                           toUpdateRoomRequest(
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