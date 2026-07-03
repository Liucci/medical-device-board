import { API_BASE_URL } from "../../../client/apiClient"
import { CreateDeviceTypeType } from "../../../types/deviceTypeTypes"
import { getDeviceTypesFromApi } from "../../deviceTypes/fetchDeviceTypes"
import {
         normalizeDeviceType,
         toCreateDeviceTypeRequest
       } from "../../../utils/deviceTypeMapper"
import { authFetch } from "../../../client/apiClient"

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

  await authFetch(
                `${API_BASE_URL}/device-types`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
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