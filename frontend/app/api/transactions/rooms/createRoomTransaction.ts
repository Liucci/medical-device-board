import { API_BASE_URL } from "../../../client/apiClient"
import { CreateRoomType } from "../../../types/roomTypes"
import { getRoomsFromApi } from "../../../api/rooms/fetchRooms"
import { authFetch } from "../../../client/apiClient"
import {
         normalizeRoom,
         toCreateRoomRequest
       } from "../../../utils/roomsMapper"

type CreateRoomTransactionParams = {
                                     room: CreateRoomType
                                     setRooms: any
                                     onClose?: () => void
                                   }

export async function createRoomTransaction({
                                               room,
                                               setRooms,
                                               onClose
                                             }: CreateRoomTransactionParams
                                           )
{
  console.log("createRoomTransaction")
  await authFetch(
                `${API_BASE_URL}/rooms`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
                            },
                  body: JSON.stringify(
                                          toCreateRoomRequest(
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

  if (onClose) {onClose()}
}