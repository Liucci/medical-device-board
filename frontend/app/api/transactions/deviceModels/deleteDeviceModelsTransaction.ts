import { API_BASE_URL } from "../../client/apiClient"
import { DeleteDeviceModelsFrontType } from "../../../types/deviceModelTypes"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import {
         normalizeDeviceModel,
         toDeleteDeviceModelsRequest
       } from "../../../utils/deviceModelMapper"
import {  } from "../../client/apiClient"
type DeleteDeviceModelsTransactionParams = {
                                              deviceModels: DeleteDeviceModelsFrontType
                                              setDeviceModels: any
                                            }

export async function deleteDeviceModelsTransaction({
                                                       deviceModels,
                                                       setDeviceModels
                                                     }: DeleteDeviceModelsTransactionParams
                                                   )
{
  console.log("deleteDeviceModelsTransaction")


  await fetch(
                `${API_BASE_URL}/delete-device-models`,
                {
                  method: "POST",
                  headers: {
                "Content-Type":
                "application/json"
                            },
                  credentials: "include",
                  body: JSON.stringify(toDeleteDeviceModelsRequest(deviceModels))
                }
              )

  const deviceModelsResponse =await getDeviceModelsFromApi()

  setDeviceModels(deviceModelsResponse.map(normalizeDeviceModel))
}