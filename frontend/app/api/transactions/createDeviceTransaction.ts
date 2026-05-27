import { Device } from "../../types/deviceTypes"

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
    "http://127.0.0.1:8000/create-device-transaction",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        "Authorization":
          `Bearer ${token}`
      },

      body: JSON.stringify({
        type:
          params.type,

        model:
          params.model,

        asset_type:
          params.assetType,

        rental_start_date:
          params.rentalStartDate,

        rental_end_date:
          params.rentalEndDate
      })
    }
  )

  return await response.json()
}