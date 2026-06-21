import { API_BASE_URL } from "../../client"

import { getDevicesFromApi } from "../../devices/fetchDevices"
import { getRoomsFromApi } from "../../rooms/fetchRooms"
import { getHistoriesFromApi } from "../../histories/fetchHistories"
import { getTasksFromApi } from "../../tasks/fetchTasks"

import { normalizeDevice } from "../../../utils/deviceMapper"
import { normalizeRoom } from "../../../utils/roomsMapper"
import { normalizeHistory } from "../../../utils/historyMapper"
import { normalizeMaintenanceTask } from "../../../utils/taskMapper"
import { authFetch } from "../../client"


type MoveRoomToRoomNewPatientTransactionParams = {
                                                    deviceId: number
                                                    preRoomId: number
                                                    postRoomId: number
                                                    patientName: string
                                                    setDevices: any
                                                    setRooms: any
                                                    setHistories: any
                                                    setTasks: any
                                                  }

export async function moveRoomToRoomNewPatientTransaction({
                                                            deviceId,
                                                            preRoomId,
                                                            postRoomId,
                                                            patientName,
                                                            setDevices,
                                                            setRooms,
                                                            setHistories,
                                                            setTasks
                                                          }: MoveRoomToRoomNewPatientTransactionParams
                                                        )
{
  console.log("moveRoomToRoomNewPatientTransaction")

  await authFetch(
                `${API_BASE_URL}/move_room_to_room_new_patient`,
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

  const devices = await getDevicesFromApi()
  setDevices(devices.map(normalizeDevice))

  const rooms = await getRoomsFromApi()
  setRooms(rooms.map(normalizeRoom))

  const histories = await getHistoriesFromApi()
  setHistories(histories.map(normalizeHistory))

  const tasks = await getTasksFromApi()
  setTasks(tasks.map(normalizeMaintenanceTask))
}