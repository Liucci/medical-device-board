import { API_BASE_URL } from "../../../client/apiClient"

import { getDevicesFromApi } from "../../devices/fetchDevices"
import { getRoomsFromApi } from "../../rooms/fetchRooms"
import { getHistoriesFromApi } from "../../histories/fetchHistories"
import { getTasksFromApi } from "../../tasks/fetchTasks"

import { normalizeDevice } from "../../../utils/deviceMapper"
import { normalizeRoom } from "../../../utils/roomsMapper"
import { normalizeHistory } from "../../../utils/historyMapper"
import { normalizeMaintenanceTask } from "../../../utils/taskMapper"
import { authFetch } from "../../../client/apiClient"
import{Device} from "../../../types/deviceTypes"


type MoveStockToRoomTransactionParams = {
                                          deviceId: number
                                          roomId: number
                                          patientName: string
                                          setDevices: any
                                          setRooms: any
                                          setHistories: any
                                          setTasks: any
                                          devices: Device[]
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
                                                   devices,
                                                   onClose
                                                 }: MoveStockToRoomTransactionParams
                                               )
{
  console.log("moveStockToRoomTransaction")
  const previousDevices = [...devices]
  setDevices((prev : Device[])=>
      prev.map(device =>
        device.id === deviceId
          ? {
              ...device,
              status: "room",
              roomId: roomId,
              stockAreaId: undefined,            
              }: device
      )
  )


try{
      const response =await authFetch(
                    `${API_BASE_URL}/move_stock_to_room`,
                    {
                      method: "POST",
                      headers: {
                                "Content-Type":
                                "application/json"
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

  if (onClose) {onClose()}
}