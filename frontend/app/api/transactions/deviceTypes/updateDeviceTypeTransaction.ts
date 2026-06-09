import { API_BASE_URL } from "../../client"
import { UpdateDeviceTypeType } from "../../../types/deviceTypeTypes"
import { getDeviceTypesFromApi } from "../../deviceTypes/fetchDeviceTypes"
import {
         normalizeDeviceType,
         toUpdateDeviceTypeRequest
       } from "../../../utils/deviceTypeMapper"

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

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}/update-device-type`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
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