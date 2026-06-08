import { API_BASE_URL } from "../../client"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import {
         normalizeDeviceModel,
         toCreateDeviceModelRequest
       } from "@/app/utils/deviceModelMapper"

export async function createDeviceModelTransaction(
                                                    deviceTypeId: number,
                                                    name: string,
                                                    setDeviceModels: any
                                                  )
{
    const trimmed = name.trim()
    if (!trimmed) {return}

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
                    body: JSON.stringify(
                                            toCreateDeviceModelRequest(
                                                                         deviceTypeId,
                                                                         trimmed
                                                                       )
                                          )
                  }
                )

    const deviceModels = await getDeviceModelsFromApi()
    if (!deviceModels) {return}

    setDeviceModels(
                      deviceModels.map(normalizeDeviceModel)
                   )
}