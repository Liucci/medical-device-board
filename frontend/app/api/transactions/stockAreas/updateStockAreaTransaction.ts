import { API_BASE_URL } from "../../client"

import { getStockAreasFromApi } from "../../stockAreas/fetchStockAreas"
import { normalizeStockArea } from "../../../utils/stockAreaMapper"

type UpdateStockAreaTransactionParams = {
                                          id: number
                                          name: string
                                          setStockAreas: any
                                        }

export async function updateStockAreaTransaction({
                                                    id,
                                                    name,
                                                    setStockAreas,
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
                    body: JSON.stringify({
                                            id: id,
                                            name: name
                                          })
                  }
                )

    const stockAreas =
      await getStockAreasFromApi()

    setStockAreas(stockAreas.map(normalizeStockArea))
}