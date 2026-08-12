import { API_BASE_URL } from "../../client/apiClient"
import { UpdateStockAreaType } from "../../../types/stockTypes"
import { getStockAreasFromApi } from "../../stockAreas/fetchStockAreas"
import { authFetch } from "../../client/apiClient"
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

  await fetch(
                `${API_BASE_URL}/update-stock-area-transaction`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
                            },credentials: "include",
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