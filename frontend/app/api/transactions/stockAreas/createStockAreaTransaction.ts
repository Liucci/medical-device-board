import { API_BASE_URL } from "../../client"
import { StockArea } from "../../../types/stockTypes"

import { getStockAreasFromApi } from "../../stockAreas/fetchStockAreas"
import { normalizeStockArea,toDBStockArea } from "../../../utils/stockAreaMapper"

type CreateStockAreaTransactionParams = {
                                          params: StockArea
                                          setStockAreas: any
                                        }

export async function createStockAreaTransaction({
                                                    params,
                                                    setStockAreas,
                                                  }: CreateStockAreaTransactionParams
                                                )
{
    console.log("createStockAreaTransaction")

    const token = localStorage.getItem("access_token")
    if (!token) {return}

    await fetch(
                  `${API_BASE_URL}/create-stock-area-transaction`,
                  {
                    method: "POST",
                    headers: {
                                "Content-Type":"application/json",
                                "Authorization":`Bearer ${token}`
                              },
                    body: JSON.stringify(toDBStockArea(params))
                  }
                )

    const stockAreas =
      await getStockAreasFromApi()

    setStockAreas(stockAreas.map(normalizeStockArea))
}