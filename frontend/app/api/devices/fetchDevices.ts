import { API_BASE_URL ,authFetch} from "../client"
import { Device, DeviceDB } from "@/app/types/deviceTypes"
import { normalizeDevice } from "../../utils/deviceMapper"

export async function getDevicesFromApi(): Promise<DeviceDB[]> {

    console.log("fetchDevices")

    const response = await authFetch(
                            `${API_BASE_URL}/devices`,
                            {
                                method: "GET",
                                headers: {
                                        "Content-Type":
                                        "application/json"
                                }
                            }
                        )



    return await response.json()
}