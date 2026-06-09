import { API_BASE_URL } from "../../client"
import { CreateDeviceTypeType } from "../../../types/deviceTypeTypes"
import { getDeviceTypesFromApi } from "../../deviceTypes/fetchDeviceTypes"
import {
         normalizeDeviceType,
         toCreateDeviceTypeRequest
       } from "../../../utils/deviceTypeMapper"

type CreateDeviceTypeTransactionParams = {
                                            deviceType: CreateDeviceTypeType
                                            setDeviceTypes: any
                                            onClose?: () => void
                                          }

export async function createDeviceTypeTransaction({
                                                    deviceType,
                                                    setDeviceTypes,
                                                    onClose
                                                  }: CreateDeviceTypeTransactionParams
                                                )
{
  console.log("createDeviceTypeTransaction")

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}/device-types`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
                            },
                  body: JSON.stringify(
                                          toCreateDeviceTypeRequest(
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

  if (onClose) {onClose()}
}