import { API_BASE_URL } from "../../client"
import { getStockAreasFromApi } from "../../stockAreas/fetchStockAreas"

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

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}/delete-stock-area-transaction`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
                            },
                  body: JSON.stringify(
                                          toDeleteStockAreasRequest(
                                                                       stockAreaIds
                                                                     )
                                        )
                }
              )

  const stockAreas =
    await getStockAreasFromApi()

  setStockAreas(
                  stockAreas.map(
                                   normalizeStockArea
                                 )
                )

  if (onClose) {onClose()}
}