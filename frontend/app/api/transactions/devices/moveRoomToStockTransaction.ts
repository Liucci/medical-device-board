<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

import { getDevicesFromApi } from "../../devices/fetchDevices"
import { getRoomsFromApi } from "../../rooms/fetchRooms"
import { getHistoriesFromApi } from "../../histories/fetchHistories"
import { getTasksFromApi } from "../../tasks/fetchTasks"

import { normalizeDevice } from "../../../utils/deviceMapper"
import { normalizeRoom } from "../../../utils/roomsMapper"
import { normalizeHistory } from "../../../utils/historyMapper"
import { normalizeMaintenanceTask } from "../../../utils/taskMapper"
<<<<<<< HEAD
import { authFetch } from "../../client/apiClient"
=======
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import{Device} from "../../../types/deviceTypes"
import{RoomType} from "../../../types/roomTypes"
import{MaintenanceType} from "../../../types/maintenanceTypeTypes"
import { getRoomInfectionsFromApi } from "../../roomInfections/fetchRoomInfections"
import { normalizeRoomInfection } from "../../../utils/roomInfectionMapper"
import { RoomInfectionType } from "../../../types/roomInfectionTypes"

type MoveRoomToStockTransactionParams = {
                                          deviceId: number
                                          roomId: number
                                          stockAreaId: number
                                          setDevices: any
                                          setRooms: any
                                          setHistories: any
                                          setTasks: any
                                          setRoomInfections:any
                                          devices: Device[]
                                          
                                        }

export async function moveRoomToStockTransaction({
                                                   deviceId,
                                                   roomId,
                                                   stockAreaId,
                                                   setDevices,
                                                   setRooms,
                                                   setHistories,
                                                   setTasks,
                                                   setRoomInfections,
                                                   devices,
                                                 }: MoveRoomToStockTransactionParams
                                               )
{
  console.log("moveRoomToStockTransaction")
  const previousDevices = [...devices]
  //optimistic update
  setDevices((prev: Device[]) =>
  prev.map(device =>
    device.id === deviceId
      ? {
          ...device,
          status: "stock",
          roomId: null,
          stockAreaId
        }
      : device
  )
)
try{
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

  const tasks = await getTasksFromApi()
  setTasks(tasks.map(normalizeMaintenanceTask))
  const roomInfections =await getRoomInfectionsFromApi()
  setRoomInfections(roomInfections.map(normalizeRoomInfection))
}