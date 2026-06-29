import { API_BASE_URL } from "../../client"
import { getStockAreasFromApi } from "../../stockAreas/fetchStockAreas"
import { authFetch } from "../../client"

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

  const response =await authFetch(
                `${API_BASE_URL}/delete-stock-area-transaction`,
                {
                  method: "POST",
                  headers: {
                "Content-Type":
                "application/json"
                            },
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