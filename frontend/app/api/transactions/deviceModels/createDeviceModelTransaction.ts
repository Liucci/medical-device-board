<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { CreateDeviceModelType } from "../../../types/deviceModelTypes"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import {
         normalizeDeviceModel,
         toCreateDeviceModelRequest
       } from "../../../utils/deviceModelMapper"
<<<<<<< HEAD
import { authFetch } from "../../client/apiClient"
=======
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

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

  await authFetch(
                `${API_BASE_URL}/device-models`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":
                              "application/json"
                            },
                  body: JSON.stringify(
                                          toCreateDeviceModelRequest(
                                                                        deviceModel
                                                                      )
                                        )
                }
              )

  const deviceModels =await getDeviceModelsFromApi()

  setDeviceModels(
                    deviceModels.map(
                                      normalizeDeviceModel
                                    )
                  )

  if (onClose) {onClose()}
}