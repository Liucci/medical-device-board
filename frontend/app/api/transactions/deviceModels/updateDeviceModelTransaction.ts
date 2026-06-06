import { API_BASE_URL } from "../../client"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import { normalizeDeviceModel } from "../../../utils/deviceModelMapper"

type Params = {
                id: number
                name: string
                setDeviceModels: React.Dispatch<React.SetStateAction<any[]>>
              }

export async function updateDeviceModelTransaction({
                                                      id,
                                                      name,
                                                      setDeviceModels
                                                    }: Params)
{
    const token = localStorage.getItem("access_token")
    if (!token) {return}

    await fetch(
                  `${API_BASE_URL}/update-device-model`,
                  {
                    method: "POST",
                    headers: {
                                "Content-Type":"application/json",
                                "Authorization":`Bearer ${token}`
                              },
                    body: JSON.stringify({
                                            id,
                                            name
                                          })
                  }
                )

    const deviceModels = await getDeviceModelsFromApi()
    if (!deviceModels) {return}

    setDeviceModels(deviceModels.map(normalizeDeviceModel))
}