import { API_BASE_URL ,} from "../client/apiClient"
import { Device, DeviceDB } from "@/app/types/deviceTypes"
import { normalizeDevice } from "../../utils/deviceMapper"

export async function getDevicesFromApi(): Promise<DeviceDB[]> {

    console.log("fetchDevices")

    const response = await fetch(
                            `${API_BASE_URL}/devices`,
                            {
                                method: "GET",
                                headers: {
                                        "Content-Type":
                                        "application/json"
                                },
                                credentials: "include",
                            }
                        )



    return await response.json()
}