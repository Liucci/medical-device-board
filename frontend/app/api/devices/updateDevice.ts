import { API_BASE_URL } from "../client"
import { Device } from "../../types/deviceTypes"

type UpdateDeviceParams = {
                          deviceId: number
                          column: keyof Device
                          value: any
                        }

export async function updateDevice(
                                    params: UpdateDeviceParams
                                  )
{
    console.log("updateDevice")
    const token = localStorage.getItem("access_token")
    if (!token) {return}
    await fetch(
                  `${API_BASE_URL}/update-device`,
                  {
                    method: "POST",
                    headers: {
                                "Content-Type":"application/json",
                                "Authorization":`Bearer ${token}`
                              },
                    body: JSON.stringify({
                                            device_id: params.deviceId,
                                            column: params.column,
                                            value: params.value
                                          })
                  }
                )
}