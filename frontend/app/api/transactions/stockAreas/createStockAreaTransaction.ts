import { API_BASE_URL } from "../../client"
import { CreateStockAreaType } from "../../../types/stockTypes"
import { getStockAreasFromApi } from "../../stockAreas/fetchStockAreas"

import {
         normalizeStockArea,
         toCreateStockAreaRequest
       } from "../../../utils/stockAreaMapper"

type CreateStockAreaTransactionParams = {
                                          stockArea: CreateStockAreaType
                                          setStockAreas: any
                                          onClose?: () => void
                                        }

export async function createStockAreaTransaction({
                                                    stockArea,
                                                    setStockAreas,
                                                    onClose
                                                  }: CreateStockAreaTransactionParams
                                                )
{
  console.log("createStockAreaTransaction")

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}//create-stock-area-transaction`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
                            },
                  body: JSON.stringify(
                                          toCreateStockAreaRequest(
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