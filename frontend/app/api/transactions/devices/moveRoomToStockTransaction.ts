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

type MoveRoomToStockTransactionParams = {
                                          deviceId: number
                                          roomId: number
                                          stockAreaId: number
                                          setDevices: any
                                          setRooms: any
                                          setHistories: any
                                          setTasks: any
                                        }

export async function moveRoomToStockTransaction({
                                                   deviceId,
                                                   roomId,
                                                   stockAreaId,
                                                   setDevices,
                                                   setRooms,
                                                   setHistories,
                                                   setTasks
                                                 }: MoveRoomToStockTransactionParams
                                               )
{
  console.log("moveRoomToStockTransaction")

  await authFetch(
                `${API_BASE_URL}/move_room_to_stock`,
                {
                  method: "POST",
                  headers: {
                "Content-Type":
                "application/json"
                            },
                  body: JSON.stringify({
                                          device: {
                                                    id: deviceId,
                                                    room_id: null,
                                                    stock_area_id: stockAreaId
                                                  },
                                          room: {
                                                  id: roomId
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