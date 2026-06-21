import { API_BASE_URL } from "../../client"
import { DeleteDeviceTypeType } from "../../../types/deviceTypeTypes"
import { getDeviceTypesFromApi } from "../../deviceTypes/fetchDeviceTypes"
import {
         normalizeDeviceType,
         toDeleteDeviceTypeRequest
       } from "../../../utils/deviceTypeMapper"
import { authFetch } from "../../client"

type DeleteDeviceTypeTransactionParams = {
                                            deviceType: DeleteDeviceTypeType
                                            setDeviceTypes: any
                                          }

export async function deleteDeviceTypeTransaction({
                                                    deviceType,
                                                    setDeviceTypes
                                                  }: DeleteDeviceTypeTransactionParams
                                                )
{
  console.log("deleteDeviceTypeTransaction")

  await authFetch(
                `${API_BASE_URL}/delete-device-type`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
                            },
                  body: JSON.stringify(
                                          toDeleteDeviceTypeRequest(
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