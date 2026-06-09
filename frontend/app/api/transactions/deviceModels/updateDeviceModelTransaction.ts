import { API_BASE_URL } from "../../client"
import { UpdateDeviceModelType } from "../../../types/deviceModelTypes"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import {
         normalizeDeviceModel,
         toUpdateDeviceModelRequest
       } from "../../../utils/deviceModelMapper"

type UpdateDeviceModelTransactionParams = {
                                             deviceModel: UpdateDeviceModelType
                                             setDeviceModels: any
                                           }

export async function updateDeviceModelTransaction({
                                                     deviceModel,
                                                     setDeviceModels
                                                   }: UpdateDeviceModelTransactionParams
                                                 )
{
  console.log("updateDeviceModelTransaction")

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
                  body: JSON.stringify(
                                          toUpdateDeviceModelRequest(
                                                                        deviceModel
                                                                      )
                                        )
                }
              )

  const deviceModels =
    await getDeviceModelsFromApi()

  setDeviceModels(
                    deviceModels.map(
                                      normalizeDeviceModel
                                    )
                  )
}