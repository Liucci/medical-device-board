import { API_BASE_URL } from "../../client"
import { DeleteDeviceModelsType } from "../../../types/deviceModelTypes"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import {
         normalizeDeviceModel,
         toDeleteDeviceModelsRequest
       } from "../../../utils/deviceModelMapper"

type DeleteDeviceModelsTransactionParams = {
                                              deviceModels: DeleteDeviceModelsType
                                              setDeviceModels: any
                                            }

export async function deleteDeviceModelsTransaction({
                                                       deviceModels,
                                                       setDeviceModels
                                                     }: DeleteDeviceModelsTransactionParams
                                                   )
{
  console.log("deleteDeviceModelsTransaction")

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
                  body: JSON.stringify(
                                          toDeleteDeviceModelsRequest(
                                                                        deviceModels
                                                                      )
                                        )
                }
              )

  const deviceModelsResponse =
    await getDeviceModelsFromApi()

  setDeviceModels(
                    deviceModelsResponse.map(
                                             normalizeDeviceModel
                                           )
                  )
}