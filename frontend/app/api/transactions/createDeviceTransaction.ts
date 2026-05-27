import { Device } from "../../types/deviceTypes"
import {API_BASE_URL} from "../client"

//deviceModalで取得で切る項目だけbackendに送るための型定義
type CreateDeviceTransactionParams = {
  type: Device["type"]
  model: Device["model"]
  assetType: Device["assetType"]
  rentalStartDate?: string
  rentalEndDate?: string
}

export const createDeviceTransaction = async (
  params: CreateDeviceTransactionParams
) => {

  const token =
    localStorage.getItem(
      "access_token"
    )

  if (!token) {
    console.error("token not found")
    return null
  }

  const response = await fetch(
    `${API_BASE_URL}/create-device-transaction`,
      {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        "Authorization":
          `Bearer ${token}`
      },
      //送る際はDB側のsnake_caseに変換して送る
      body: JSON.stringify({
        type:
          params.type,

        model:
          params.model,

        asset_type:
          params.assetType,

        rental_start_date:
          params.rentalStartDate|| null,

        rental_end_date:
          params.rentalEndDate|| null
      })
    }
  )

  return await response.json()
}