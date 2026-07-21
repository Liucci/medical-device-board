import { API_BASE_URL } from "../../client/apiClient"
import { CreateDeviceModelFrontType } from "../../../types/deviceModelTypes"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import {
         normalizeDeviceModel,
         toCreateDeviceModelRequest
       } from "../../../utils/deviceModelMapper"
import { authFetch } from "../../client/apiClient"

type CreateDeviceModelTransactionParams = {
                                             deviceModel: CreateDeviceModelFrontType
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
                  body: JSON.stringify(toCreateDeviceModelRequest(deviceModel))
                }
              )
  const deviceModels =await getDeviceModelsFromApi()
  setDeviceModels(deviceModels.map(normalizeDeviceModel))
  if (onClose) {onClose()}
}