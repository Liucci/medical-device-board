<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { UpdateDeviceTypeType } from "../../../types/deviceTypeTypes"
import { getDeviceTypesFromApi } from "../../deviceTypes/fetchDeviceTypes"
import {
         normalizeDeviceType,
         toUpdateDeviceTypeRequest
       } from "../../../utils/deviceTypeMapper"
<<<<<<< HEAD
import { authFetch } from "../../client/apiClient"
=======
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

type UpdateDeviceTypeTransactionParams = {
                                            deviceType: UpdateDeviceTypeType
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