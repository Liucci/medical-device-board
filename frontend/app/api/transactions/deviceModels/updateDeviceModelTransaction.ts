import { API_BASE_URL } from "../../client/apiClient"
import { UpdateDeviceModelType } from "../../../types/deviceModelTypes"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import {
         normalizeDeviceModel,
         toUpdateDeviceModelRequest
       } from "../../../utils/deviceModelMapper"
import { authFetch } from "../../client/apiClient"

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


  await authFetch(
                `${API_BASE_URL}/update-device-model`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
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