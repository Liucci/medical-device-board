import { API_BASE_URL } from "../../client"
import { CreateRoomType } from "../../../types/roomTypes"
import { getRoomsFromApi } from "../../../api/rooms/fetchRooms"

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

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}/rooms`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
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