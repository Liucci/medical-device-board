import { API_BASE_URL } from "../../client/apiClient"
import { UpdateDeviceTypeFrontType } from "../../../types/deviceTypeTypes"
import { getDeviceTypesFromApi } from "../../deviceTypes/fetchDeviceTypes"
import {
         normalizeDeviceType,
         toUpdateDeviceTypeRequest
       } from "../../../utils/deviceTypeMapper"
import { authFetch } from "../../client/apiClient"

type UpdateDeviceTypeTransactionParams = {
                                            deviceType: UpdateDeviceTypeFrontType
                                            setDeviceTypes: any
                                          }

export async function updateDeviceTypeTransaction({
                                                    deviceType,
                                                    setDeviceTypes
                                                  }: UpdateDeviceTypeTransactionParams
                                                )
{
  console.log("updateDeviceTypeTransaction")

  await authFetch(
                `${API_BASE_URL}/update-device-type`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
                            },
                  body: JSON.stringify(
                                          toUpdateDeviceTypeRequest(
                                                                      deviceType
                                                                    )
                                        )
                }
              )

  const deviceTypes =
    await getDeviceTypesFromApi()

  setDeviceTypes(
                   deviceTypes.map(
                                     normalizeDeviceType
                                   )
                 )
}