import { API_BASE_URL } from "../../client"
import { CreateDeviceModelType } from "../../../types/deviceModelTypes"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import {
         normalizeDeviceModel,
         toCreateDeviceModelRequest
       } from "../../../utils/deviceModelMapper"

type CreateDeviceModelTransactionParams = {
                                             deviceModel: CreateDeviceModelType
                                             setDeviceModels: any
                                             onClose?: () => void
                                           }

export async function createDeviceModelTransaction({
                                                     deviceModel,
                                                     setDeviceModels,
                                                     onClose
                                                   }: CreateDeviceModelTransactionParams
                                                 )
{
  console.log("createDeviceModelTransaction")

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

  if (onClose) {onClose()}
}