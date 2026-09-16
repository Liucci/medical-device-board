import { API_BASE_URL } from "../../client/apiClient"
import { DeleteDeviceModelsFrontType } from "../../../types/deviceModelTypes"
import { getDeviceModelsFromApi } from "../../deviceModels/fetchDeviceModels"
import {
        normalizeDeviceModel,
        toDeleteDeviceModelsRequest
        } from "../../../mapper/deviceModelMapper"

type DeleteDeviceModelsTransactionParams = {
                                            deviceModels: DeleteDeviceModelsFrontType
                                            setDeviceModels: any
}

export async function deleteDeviceModelsTransaction({
                                                    deviceModels,
                                                    setDeviceModels
                                                  }: DeleteDeviceModelsTransactionParams)
{
  console.log("deleteDeviceModelsTransaction")
  const response = await fetch
  (
            `${API_BASE_URL}/delete-device-models`,
            {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                              credentials: "include",
                              body: JSON.stringify(
                                toDeleteDeviceModelsRequest(deviceModels)
                      )
            }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(
      error.detail ?? "型式の削除に失敗しました。"
    )
  }

  const deviceModelsResponse = await getDeviceModelsFromApi()
  setDeviceModels(
                  deviceModelsResponse.map(normalizeDeviceModel)
  )
}