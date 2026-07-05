<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
import { CreateDeviceType, } from "../../../types/deviceTypes"
import { toDBDevice,toCreateDeviceRequest, normalizeDevice } from "../../../utils/deviceMapper"
import { getDevicesFromApi } from "../../devices/fetchDevices"
import { authFetch } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
import { CreateDeviceType, } from "../../../types/deviceTypes"
import { toDBDevice,toCreateDeviceRequest, normalizeDevice } from "../../../utils/deviceMapper"
import { getDevicesFromApi } from "../../devices/fetchDevices"
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { executeWithLoading } from "../../../components/common/executeWithLoading"
type CreateDeviceTransactionParams = {
    params: CreateDeviceType,
    setDeviceList: any
    onClose: () => void
    setLoading: React.Dispatch<React.SetStateAction<boolean>>}

export async function createDeviceTransaction({
                                                params,
                                                setDeviceList,
                                                onClose,
                                                setLoading
                                              }: CreateDeviceTransactionParams) {

  await executeWithLoading({
                              setLoading,
                              action: async () => {

                                await authFetch(
                                  `${API_BASE_URL}/create-device-transaction`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type":"application/json"
                                    },
                                    body: JSON.stringify(
                                      toCreateDeviceRequest(params)
                                    )
                                  }
                                )

                                const devices = await getDevicesFromApi()

                                setDeviceList(devices.map(normalizeDevice))

                                onClose()
                              }
                            })
}