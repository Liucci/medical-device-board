import { API_BASE_URL } from "../../client"
import { getDevicesFromApi } from "../../devices/fetchDevices"
import { getTasksFromApi } from "../../tasks/fetchTasks"
import { getHistoriesFromApi } from "../../histories/fetchHistories"
import {toDeleteDeviceRequest,normalizeDevice} from "../../../utils/deviceMapper"
import { normalizeMaintenanceTask } from "@/app/utils/taskMapper"
import { normalizeHistory } from "@/app/utils/historyMapper"
import { authFetch } from "../../client"


type DeleteDeviceTransactionParams = {
    deviceId: number
    setDeviceList: any
    setTasks: any
    setHistories: any
    onClose?: () => void
}

export async function deleteDeviceTransaction({
    deviceId,
    setDeviceList,
    setTasks,
    setHistories,
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

    const devices =
        await getDevicesFromApi()

    const tasks =
        await getTasksFromApi()

    const histories =
        await getHistoriesFromApi()

    setDeviceList(devices.map(normalizeDevice))
    setTasks(tasks.map(normalizeMaintenanceTask))
    setHistories(histories.map(normalizeHistory))

    if (onClose) {
        onClose()
    }
}