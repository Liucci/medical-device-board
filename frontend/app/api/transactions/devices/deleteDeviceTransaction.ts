import { API_BASE_URL } from "../../client"
import { getDevicesFromApi } from "../../devices/fetchDevices"
import { getTasksFromApi } from "../../tasks/fetchTasks"
import { getHistoriesFromApi } from "../../histories/fetchHistories"
import { normalizeDevice } from "../../../utils/deviceMapper"
import { normalizeMaintenanceTask } from "../../../utils/taskMapper"
import { normalizeHistory } from "../../../utils/historyMapper"

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
                                              }: DeleteDeviceTransactionParams
                                            ) {

    console.log("deleteDeviceTransaction")
    const token = localStorage.getItem("access_token")
    if (!token) {return}
    console.log("deviceId:",deviceId)

    await fetch(
                  `${API_BASE_URL}/delete-device-transaction`,
                  {
                    method: "POST",
                    headers: {
                                "Content-Type":"application/json",
                                "Authorization":`Bearer ${token}`
                              },
                    body: JSON.stringify({
                                            device_id:deviceId
                                          })
                  }
                )

    const devices = await getDevicesFromApi()
    const tasks = await getTasksFromApi()
    const histories = await getHistoriesFromApi()

    setDeviceList(devices.map(normalizeDevice))
    setTasks(tasks.map(normalizeMaintenanceTask))
    setHistories(histories.map(normalizeHistory))


    if (onClose) {onClose()}
}

