<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { UpdateDeviceModelType } from "../../../types/deviceModelTypes"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import {
         normalizeDeviceModel,
         toUpdateDeviceModelRequest
       } from "../../../utils/deviceModelMapper"
<<<<<<< HEAD
import { authFetch } from "../../client/apiClient"
=======
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

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