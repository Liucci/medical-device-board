import { API_BASE_URL } from "../../client"
import { Device } from "../../../types/deviceTypes"
import { toDBDevice,toCreateDeviceRequest } from "../../../utils/deviceMapper"
import { getDevicesFromApi } from "../../devices/fetchDevices"

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

    await fetch(
        `${API_BASE_URL}/create-device-transaction`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(
                toCreateDeviceRequest(params)
            )
        }
    )

    const devices =
        await getDevicesFromApi()

    setDeviceList(devices)

    onClose()
}