import { API_BASE_URL } from "../../client"
import { Device } from "../../../types/deviceTypes"
import { toDBDevice,toCreateDeviceRequest, normalizeDevice } from "../../../utils/deviceMapper"
import { getDevicesFromApi } from "../../devices/fetchDevices"
import { authFetch } from "../../client"
type CreateDeviceTransactionParams = {
    params: Device
    setDeviceList: any
    onClose: () => void
}

export async function createDeviceTransaction({
    params,
    setDeviceList,
    onClose
}: CreateDeviceTransactionParams) {

    console.log("createDeviceTransaction")

    const token = localStorage.getItem("access_token")

    if (!token) {
        return
    }

    await authFetch(
        `${API_BASE_URL}/create-device-transaction`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                "application/json"
                
            },
            body: JSON.stringify(
                toCreateDeviceRequest(params)
            )
        }
    )

    const devices =
        await getDevicesFromApi()

    setDeviceList(devices.map(normalizeDevice))

    onClose()
}