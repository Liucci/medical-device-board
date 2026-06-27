import { API_BASE_URL } from "../../client"
import { UpdateStockAreaOrdersType } from "../../../types/stockTypes"
import { getStockAreasFromApi } from "../../stockAreas/fetchStockAreas"
import { authFetch } from "../../client"

import {
  normalizeStockArea,
  toUpdateStockAreaOrdersRequest,
} from "../../../utils/stockAreaMapper"

type UpdateStockAreaDisplayOrderTransactionParams = {
                                                    stockAreas: UpdateStockAreaOrdersType
                                                    setStockAreas: any
                                                    }

export async function updateStockAreaDisplayOrderTransaction({
                                                            stockAreas,
                                                            setStockAreas,
                                                            }: UpdateStockAreaDisplayOrderTransactionParams)
{
  console.log("updateStockAreaDisplayOrderTransaction")

  await authFetch(
                `${API_BASE_URL}/update-stock-area-display-order`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(toUpdateStockAreaOrdersRequest(stockAreas)),
                }
  )

  const updatedStockAreas = await getStockAreasFromApi()

  setStockAreas(updatedStockAreas.map(normalizeStockArea))
}