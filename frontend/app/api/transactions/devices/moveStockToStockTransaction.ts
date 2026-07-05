<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

import { getDevicesFromApi } from "../../devices/fetchDevices"
import { getHistoriesFromApi } from "../../histories/fetchHistories"

import { normalizeDevice } from "../../../utils/deviceMapper"
import { normalizeHistory } from "../../../utils/historyMapper"
<<<<<<< HEAD
import { authFetch } from "../../client/apiClient"
=======
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import{Device} from "../../../types/deviceTypes"
type MoveStockToStockTransactionParams = {
                                          deviceId: number
                                          stockAreaId: number
                                          setDevices: any
                                          setHistories: any
                                          devices: Device[]
                                        }

export async function moveStockToStockTransaction({
                                                    deviceId,
                                                    stockAreaId,
                                                    setDevices,
                                                    setHistories,
                                                    devices
                                                  }: MoveStockToStockTransactionParams
                                                )
{
  console.log("moveStockToStockTransaction")
  const previousDevices = [...devices]

    setDevices((prev : Device[])=>
      prev.map(device =>
        device.id === deviceId
          ? {
              ...device,
              status: "stock",
              stockAreaId,
            }
          : device
      )
  )


try{
  await authFetch(
                `${API_BASE_URL}/move_stock_to_stock`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
                            },
                  body: JSON.stringify({
                                          id: deviceId,
                                          stock_area_id: stockAreaId,
                                          room_id: null
                                        })
                }
              )
            }
catch(error) {
  setDevices(previousDevices)
  throw error
}

  const refreshedDevices = await getDevicesFromApi()
  setDevices(refreshedDevices.map(normalizeDevice))

  const histories = await getHistoriesFromApi()
  setHistories(histories.map(normalizeHistory))
}