import { API_BASE_URL } from "../../client"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import { normalizeDeviceModel } from "@/app/utils/deviceModelMapper"

export async function createDeviceModelTransaction(
                                                    deviceTypeId: number,
                                                    name: string,
                                                    setDeviceModels: any
                                                  )
{
    if (!name.trim()) {return}

    const token = localStorage.getItem("access_token")
    if (!token) {return}

    await fetch(
                  `${API_BASE_URL}/device-models`,
                  {
                    method: "POST",
                    headers: {
                                "Content-Type":"application/json",
                                "Authorization":`Bearer ${token}`
                              },
                    body: JSON.stringify({
                                            device_type_id: deviceTypeId,
                                            name: name
                                          })
                  }
                )

    const deviceModels = await getDeviceModelsFromApi()
    if (!deviceModels) {return}
    console.log("typeof setDeviceModels", typeof setDeviceModels)
    console.log("setDeviceModels", setDeviceModels)

    setDeviceModels(deviceModels.map(normalizeDeviceModel))
}