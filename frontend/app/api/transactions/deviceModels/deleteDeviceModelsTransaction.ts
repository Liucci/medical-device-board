<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { DeleteDeviceModelsType } from "../../../types/deviceModelTypes"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import {
         normalizeDeviceModel,
         toDeleteDeviceModelsRequest
       } from "../../../utils/deviceModelMapper"
<<<<<<< HEAD
import { authFetch } from "../../client/apiClient"
=======
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

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