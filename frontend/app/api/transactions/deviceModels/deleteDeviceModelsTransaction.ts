import { API_BASE_URL } from "../../client"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import { normalizeDeviceModel } from "@/app/utils/deviceModelMapper"

export async function deleteDeviceModelsTransaction(
                                                      ids: number[],
                                                      setDeviceModels: React.Dispatch<React.SetStateAction<any[]>>
                                                    )
{
    const token = localStorage.getItem("access_token")
    if (!token) {return}

    await fetch(
                  `${API_BASE_URL}/delete-device-models`,
                  {
                    method: "POST",
                    headers: {
                                "Content-Type":"application/json",
                                "Authorization":`Bearer ${token}`
                              },
                    body: JSON.stringify({
                                            ids
                                          })
                  }
                )

    const deviceModels = await getDeviceModelsFromApi()
    if (!deviceModels) {return}

    setDeviceModels(deviceModels.map(normalizeDeviceModel))
}