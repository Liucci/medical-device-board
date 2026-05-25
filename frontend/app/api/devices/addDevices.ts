import { API_BASE_URL } from "../client"
import { Device } from "../../types/deviceTypes"
import { toDBDevice } from "../../utils/deviceMapper"

type AddDeviceParams = Omit<
                              Device,
                              | "id"
                              >

export async function addDeviceFromApi(
                                       params: AddDeviceParams
                                       ) {

  try {

    const token = localStorage.getItem("access_token")

    if (!token) {
      console.error("token not found")
      return null
    }

    const dbData = toDBDevice(params)

    console.log("insert device")

    for (const [key, value] of Object.entries(dbData)) {
      console.log(`・${key}: ${value}`)
    }

    const response = await fetch(
      `${API_BASE_URL}/devices`,
      {
        method: "POST",
        headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                  },
        body: JSON.stringify(dbData)
      }
    )

    const data = await response.json()
    console.log("response")
    for (const [key, value] of Object.entries(data)) {
    console.log(`・${key}: ${value}`)
}

    console.log(`add device success: ${data.success}`)

    if (!data.success) {
      console.error(`add device error: ${data.error}`)
      return null
    }

    return data

  } catch (err) {

    console.error(`add device error: ${err}`)

    return null
  }
}