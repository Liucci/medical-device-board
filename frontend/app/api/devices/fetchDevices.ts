<<<<<<< HEAD
import { API_BASE_URL ,authFetch} from "../client/apiClient"
=======
import { API_BASE_URL ,authFetch} from "../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
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