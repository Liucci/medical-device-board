import { API_BASE_URL } from "../client"
import { Device, DeviceDB } from "@/app/types/deviceTypes"
import { normalizeDevice } from "../../utils/deviceMapper"

export async function getDevicesFromApi(): Promise<DeviceDB[]> {

    console.log("fetchDevices")

    const token = localStorage.getItem("access_token")

    if (!token) {
        return []
    }

    const response = await fetch(
        `${API_BASE_URL}/devices`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return await response.json()
}