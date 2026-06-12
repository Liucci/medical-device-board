import { API_BASE_URL } from "../../client"

import { getDevicesFromApi } from "../../devices/fetchDevices"
import { getRoomsFromApi } from "../../rooms/fetchRooms"
import { getHistoriesFromApi } from "../../histories/fetchHistories"

import { normalizeDevice } from "../../../utils/deviceMapper"
import { normalizeRoom } from "../../../utils/roomsMapper"
import { normalizeHistory } from "../../../utils/historyMapper"

type MoveRoomToRoomTransactionParams = {
                                          deviceId: number
                                          preRoomId: number
                                          postRoomId: number
                                          patientName: string
                                          setDevices: any
                                          setRooms: any
                                          setHistories: any
                                        }

export async function moveRoomToRoomTransaction({
                                                  deviceId,
                                                  preRoomId,
                                                  postRoomId,
                                                  patientName,
                                                  setDevices,
                                                  setRooms,
                                                  setHistories
                                                }: MoveRoomToRoomTransactionParams
                                              )
{
  console.log("moveRoomToRoomTransaction")

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}/move_room_to_room`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
                            },
                  body: JSON.stringify({
                                          device: {
                                                    id: deviceId,
                                                    room_id: postRoomId,
                                                    stock_area_id: null
                                                  },
                                          pre_room: {
                                                        id: preRoomId
                                                     },
                                          post_room: {
                                                         id: postRoomId,
                                                         patient_name: patientName
                                                      }
                                        })
                }
              )

  const devices = await getDevicesFromApi()
  setDevices(devices.map(normalizeDevice))

  const rooms = await getRoomsFromApi()
  setRooms(rooms.map(normalizeRoom))

  const histories = await getHistoriesFromApi()
  setHistories(histories.map(normalizeHistory))
}