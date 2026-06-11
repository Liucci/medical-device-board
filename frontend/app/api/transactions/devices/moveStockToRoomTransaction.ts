import { API_BASE_URL } from "../../client"

import { getDevicesFromApi } from "../../devices/fetchDevices"
import { getRoomsFromApi } from "../../rooms/fetchRooms"
import { getHistoriesFromApi } from "../../histories/fetchHistories"
import { getTasksFromApi } from "../../tasks/fetchTasks"

import { normalizeDevice } from "../../../utils/deviceMapper"
import { normalizeRoom } from "../../../utils/roomsMapper"
import { normalizeHistory } from "../../../utils/historyMapper"
import { normalizeMaintenanceTask } from "../../../utils/taskMapper"

type MoveStockToRoomTransactionParams = {
                                          deviceId: number
                                          roomId: number
                                          patientName: string
                                          setDevices: any
                                          setRooms: any
                                          setHistories: any
                                          setTasks: any
                                          onClose?: () => void
                                        }

export async function moveStockToRoomTransaction({
                                                   deviceId,
                                                   roomId,
                                                   patientName,
                                                   setDevices,
                                                   setRooms,
                                                   setHistories,
                                                   setTasks,
                                                   onClose
                                                 }: MoveStockToRoomTransactionParams
                                               )
{
  console.log("moveStockToRoomTransaction")

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  const response =await fetch(
                `${API_BASE_URL}/move_stock_to_room`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
                            },
                  body: JSON.stringify({
                                          device: {
                                                    id: deviceId,
                                                    room_id: roomId,
                                                    stock_area_id: null
                                                  },
                                          room: {
                                                  id: roomId,
                                                  patient_name: patientName
                                                }
                                        })
                }
              )
    console.log("stock-room response",response.status)
    console.log(await response.text())
  const devices = await getDevicesFromApi()
  
  setDevices(devices.map(normalizeDevice))

  const rooms = await getRoomsFromApi()
  setRooms(rooms.map(normalizeRoom))

  const histories = await getHistoriesFromApi()
  setHistories(histories.map(normalizeHistory))

  const tasks = await getTasksFromApi()
  setTasks(tasks.map(normalizeMaintenanceTask))

  if (onClose) {onClose()}
}