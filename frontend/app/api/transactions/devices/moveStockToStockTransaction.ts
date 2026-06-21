import { API_BASE_URL } from "../../client"

import { getDevicesFromApi } from "../../devices/fetchDevices"
import { getHistoriesFromApi } from "../../histories/fetchHistories"

import { normalizeDevice } from "../../../utils/deviceMapper"
import { normalizeHistory } from "../../../utils/historyMapper"
import { authFetch } from "../../client"

type MoveStockToStockTransactionParams = {
                                          deviceId: number
                                          stockAreaId: number
                                          setDevices: any
                                          setHistories: any
                                        }

export async function moveStockToStockTransaction({
                                                    deviceId,
                                                    stockAreaId,
                                                    setDevices,
                                                    setHistories
                                                  }: MoveStockToStockTransactionParams
                                                )
{
  console.log("moveStockToStockTransaction")

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

  const devices = await getDevicesFromApi()
  setDevices(devices.map(normalizeDevice))

  const histories = await getHistoriesFromApi()
  setHistories(histories.map(normalizeHistory))
}