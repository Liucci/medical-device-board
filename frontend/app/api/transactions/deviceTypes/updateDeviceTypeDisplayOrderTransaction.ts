import { API_BASE_URL } from "../../client/apiClient"
import { UpdateDeviceTypeOrdersType } from "../../../types/deviceTypeTypes"
import { getDeviceTypesFromApi } from "../../deviceTypes/fetchDeviceTypes"

import {
    normalizeDeviceType,
    toUpdateDeviceTypeOrdersRequest,
} from "../../../mapper/deviceTypeMapper"


type UpdateDeviceTypeDisplayOrderTransactionParams = {
                                            deviceTypes: UpdateDeviceTypeOrdersType
                                            setDeviceTypes: any
}


export async function updateDeviceTypeDisplayOrderTransaction({
                                                            deviceTypes,
                                                            setDeviceTypes,
}: UpdateDeviceTypeDisplayOrderTransactionParams) {

  console.log("updateDeviceTypeDisplayOrderTransaction")

  await fetch(
            `${API_BASE_URL}/update-device-type-display-order`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify(
                                    toUpdateDeviceTypeOrdersRequest(deviceTypes)
                ),
            }
  )

  const updatedDeviceTypes = await getDeviceTypesFromApi()
  setDeviceTypes(updatedDeviceTypes.map(normalizeDeviceType))
}