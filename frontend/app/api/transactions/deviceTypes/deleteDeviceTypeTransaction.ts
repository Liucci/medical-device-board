
import { API_BASE_URL } from "../../client/apiClient"
import { DeleteDeviceTypeFrontType } from "../../../types/deviceTypeTypes"
import { getDeviceTypesFromApi } from "../../deviceTypes/fetchDeviceTypes"
import {
  normalizeDeviceType,
  toDeleteDeviceTypeRequest
} from "../../../mapper/deviceTypeMapper"

type DeleteDeviceTypeTransactionParams = {
  deviceType: DeleteDeviceTypeFrontType
  setDeviceTypes: any
}

export async function deleteDeviceTypeTransaction({
  deviceType,
  setDeviceTypes
}: DeleteDeviceTypeTransactionParams) {
  console.log("deleteDeviceTypeTransaction")

  const response = await fetch(
    `${API_BASE_URL}/delete-device-type`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(
        toDeleteDeviceTypeRequest(deviceType)
      )
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail ?? "機種の削除に失敗しました。")
  }

  const deviceTypes = await getDeviceTypesFromApi()

  setDeviceTypes(
    deviceTypes.map(normalizeDeviceType)
  )
}

