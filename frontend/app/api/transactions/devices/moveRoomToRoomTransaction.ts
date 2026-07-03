import { API_BASE_URL } from "../../../client/apiClient"

import { getDevicesFromApi } from "../../devices/fetchDevices"
import { getRoomsFromApi } from "../../rooms/fetchRooms"
import { getHistoriesFromApi } from "../../histories/fetchHistories"

import { normalizeDevice } from "../../../utils/deviceMapper"
import { normalizeRoom } from "../../../utils/roomsMapper"
import { normalizeHistory } from "../../../utils/historyMapper"
import { authFetch } from "../../../client/apiClient"
import{Device} from "../../../types/deviceTypes"
import { getRoomInfectionsFromApi } from "../../roomInfections/fetchRoomInfections"
import { normalizeRoomInfection } from "../../../utils/roomInfectionMapper"

type MoveRoomToRoomTransactionParams = {
                                          deviceId: number
                                          preRoomId: number
                                          postRoomId: number
                                          patientName: string
                                          setDevices: any
                                          setRooms: any
                                          setHistories: any
                                          setRoomInfections:any
                                          devices: Device[]
                                        }

export async function moveRoomToRoomTransaction({
                                                  deviceId,
                                                  preRoomId,
                                                  postRoomId,
                                                  patientName,
                                                  setDevices,
                                                  setRooms,
                                                  setHistories,
                                                  setRoomInfections,
                                                  devices
                                                }: MoveRoomToRoomTransactionParams
                                              )
{
  console.log("moveRoomToRoomTransaction")

  const previousDevices = [...devices]

setDevices((prev: Device[]) =>
  prev.map(device =>
    device.id === deviceId
      ? {
          ...device,
          status: "room",
          roomId: postRoomId
        }
      : device
  )
)
try {
  await authFetch(
                `${API_BASE_URL}/move_room_to_room`,
                {
                  method: "POST",
                  headers: {
                "Content-Type":
                "application/json"
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
              }
catch(error) {
  setDevices(previousDevices)
  throw error
}


  const refreshedDevices = await getDevicesFromApi()
  setDevices(refreshedDevices.map(normalizeDevice))

  const rooms = await getRoomsFromApi()
  setRooms(rooms.map(normalizeRoom))

  const histories = await getHistoriesFromApi()
  setHistories(histories.map(normalizeHistory))
  const roomInfections =await getRoomInfectionsFromApi()
  setRoomInfections(roomInfections.map(normalizeRoomInfection))
  
}