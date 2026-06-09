import { API_BASE_URL } from "../../client"
import { UpdateStockAreaType } from "../../../types/stockTypes"
import { getStockAreasFromApi } from "../../stockAreas/fetchStockAreas"

import {
         normalizeStockArea,
         toUpdateStockAreaRequest
       } from "../../../utils/stockAreaMapper"

type UpdateStockAreaTransactionParams = {
                                          stockArea: UpdateStockAreaType
                                          setStockAreas: any
                                          onClose?: () => void
                                        }

export async function updateStockAreaTransaction({
                                                    stockArea,
                                                    setStockAreas,
                                                    onClose
                                                  }: UpdateStockAreaTransactionParams
                                                )
{
  console.log("updateStockAreaTransaction")

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}/update-stock-area-transaction`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
                            },
                  body: JSON.stringify(
                                          toUpdateStockAreaRequest(
                                                                       stockArea
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