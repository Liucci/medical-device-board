import { API_BASE_URL } from "../../client"
import { DeleteDeviceModelsType } from "../../../types/deviceModelTypes"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import {
         normalizeDeviceModel,
         toDeleteDeviceModelsRequest
       } from "../../../utils/deviceModelMapper"
import { authFetch } from "../../client"

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


  await authFetch(
                `${API_BASE_URL}/delete-device-models`,
                {
                  method: "POST",
                  headers: {
                "Content-Type":
                "application/json"
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