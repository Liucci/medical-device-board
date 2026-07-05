<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { CreateDeviceTypeType } from "../../../types/deviceTypeTypes"
import { getDeviceTypesFromApi } from "../../deviceTypes/fetchDeviceTypes"
import {
         normalizeDeviceType,
         toCreateDeviceTypeRequest
       } from "../../../utils/deviceTypeMapper"
<<<<<<< HEAD
import { authFetch } from "../../client/apiClient"
=======
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

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