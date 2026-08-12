import { API_BASE_URL } from "../../client/apiClient"
import { getStockAreasFromApi } from "../../stockAreas/fetchStockAreas"
import { authFetch } from "../../client/apiClient"

import {
         normalizeStockArea,
         toDeleteStockAreasRequest
       } from "../../../utils/stockAreaMapper"

type DeleteStockAreaTransactionParams = {
                                          stockAreaIds: number[]
                                          setStockAreas: any
                                          onClose?: () => void
                                        }

export async function deleteStockAreaTransaction({
                                                    stockAreaIds,
                                                    setStockAreas,
                                                    onClose
                                                  }: DeleteStockAreaTransactionParams
                                                )
{
  console.log("deleteStockAreaTransaction")

  const response =await fetch(
                `${API_BASE_URL}/delete-stock-area-transaction`,
                {
                  method: "POST",
                  headers: {
                "Content-Type":
                "application/json"
                            },
                  credentials: "include",
                  body: JSON.stringify(
                                          toDeleteStockAreasRequest(
                                                                       stockAreaIds
                                                                     )
                                        )
                }
              )
  if (!response.ok) {
    const error = await response.json()
    alert(error.detail)
    return
  }

  const stockAreas =
    await getStockAreasFromApi()

  setStockAreas(
                  stockAreas.map(
                                   normalizeStockArea
                                 )
                )

  if (onClose) {onClose()}
}