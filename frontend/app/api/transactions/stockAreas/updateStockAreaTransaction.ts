<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
import { UpdateStockAreaType } from "../../../types/stockTypes"
import { getStockAreasFromApi } from "../../stockAreas/fetchStockAreas"
import { authFetch } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
import { UpdateStockAreaType } from "../../../types/stockTypes"
import { getStockAreasFromApi } from "../../stockAreas/fetchStockAreas"
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

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

  await authFetch(
                `${API_BASE_URL}/update-stock-area-transaction`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
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