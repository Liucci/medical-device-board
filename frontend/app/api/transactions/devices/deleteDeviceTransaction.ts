import { API_BASE_URL } from "../../client"
import { getDevicesFromApi } from "../../devices/fetchDevices"
import { getTasksFromApi } from "../../tasks/fetchTasks"
import { getHistoriesFromApi } from "../../histories/fetchHistories"
import {toDeleteDeviceRequest,normalizeDevice} from "../../../utils/deviceMapper"
import { normalizeMaintenanceTask } from "@/app/utils/taskMapper"
import { normalizeHistory } from "@/app/utils/historyMapper"
import { getRoomsFromApi } from "../../rooms/fetchRooms"
import { getRoomInfectionsFromApi } from "../../roomInfections/fetchRoomInfections"

import { normalizeRoom } from "@/app/utils/roomsMapper"
import { normalizeRoomInfection } from "@/app/utils/roomInfectionMapper"
import { authFetch } from "../../client"


type DeleteDeviceTransactionParams = {
    deviceId: number
    setDeviceList: any
    setTasks: any
    setHistories: any
    setRooms: any
    setRoomInfections: any
    onClose?: () => void
}

export async function deleteDeviceTransaction({
    deviceId,
    setDeviceList,
    setTasks,
    setHistories,
    setRooms,
    setRoomInfections,
    onClose
}: DeleteDeviceTransactionParams) {

    console.log("deleteDeviceTransaction")



    await authFetch(
        `${API_BASE_URL}/delete-device-transaction`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                "application/json"
            },
            body: JSON.stringify(
            toDeleteDeviceRequest(deviceId)
            )        
        }
    )

    const devices =await getDevicesFromApi()
    const tasks =await getTasksFromApi()
    const histories =await getHistoriesFromApi()
    const rooms = await getRoomsFromApi()
    const roomInfections =await getRoomInfectionsFromApi()

    setDeviceList(devices.map(normalizeDevice))
    setTasks(tasks.map(normalizeMaintenanceTask))
    setHistories(histories.map(normalizeHistory))
    setRooms(rooms.map(normalizeRoom))
    setRoomInfections(roomInfections.map(normalizeRoomInfection))

    if (onClose) {
        onClose()
    }
}