import { API_BASE_URL } from "../../client"
import { Device } from "../../../types/deviceTypes"
import { toDBDevice } from "../../../utils/deviceMapper"
import { getDevicesFromApi }from "../../devices/fetchDevices"
import { normalizeDevice }from "../../../utils/deviceMapper"
type CreateDeviceTransactionParams = {
                                      params: Device
                                      setDeviceList: any
                                      onClose: () => void
                                    }

export async function createDeviceTransaction({
                                                params,
                                                setDeviceList,
                                                onClose
                                              }: CreateDeviceTransactionParams
                                            )
{
    console.log("createDeviceTransaction")

    const token = localStorage.getItem("access_token")
    if (!token) {return}

    await fetch(
                  `${API_BASE_URL}/create-device-transaction`,
                  {
                    method: "POST",
                    headers: {
                                "Content-Type":"application/json",
                                "Authorization":`Bearer ${token}`
                              },
                    body: JSON.stringify(
                                            toDBDevice(params)
                                          )
                  }
                )

    const deviceList =
      await getDevicesFromApi()

    setDeviceList(deviceList.map(normalizeDevice))
    console.log("deviceList:",deviceList)

    onClose()
}