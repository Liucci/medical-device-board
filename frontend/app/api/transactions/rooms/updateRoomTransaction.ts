import { API_BASE_URL } from "../../client/apiClient"
import { UpdateRoomType } from "../../../types/roomTypes"
import { getRoomsFromApi } from "../../rooms/fetchRooms"
import { authFetch } from "../../client/apiClient"

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

  const response = await authFetch(
                                 `${API_BASE_URL}/update-room`,
                                 {
                                   method: "POST",
                                   headers: {
                                              "Content-Type":
                                              "application/json"
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