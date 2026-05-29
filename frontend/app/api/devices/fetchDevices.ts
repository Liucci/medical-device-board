import { API_BASE_URL } from "../client"
import { normalizeDevice} from "../../utils/deviceMapper"


export async function getDevicesFromApi(setDeviceList: any)
 {
    console.log("fetchDevices")
    const token =localStorage.getItem("access_token")
    if (!token) {return}
    const response =await fetch(
                        `${API_BASE_URL}/devices`,
                        {
                          method: "GET",
                          headers: {
                                      Authorization:
                                        `Bearer ${token}`
                                    }
                        }
                      )
    const data =await response.json()
    setDeviceList(data.map(normalizeDevice))
}