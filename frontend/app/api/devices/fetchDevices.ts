import { API_BASE_URL } from "../client"
import { normalizeDevice} from "../../utils/deviceMapper"

//fetch系関数はbackより情報を受け取るretrunが必要
export async function getDevicesFromApi()
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
    return await response.json()
}