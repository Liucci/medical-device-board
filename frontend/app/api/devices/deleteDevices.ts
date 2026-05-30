
import { API_BASE_URL } from "../client"
import { normalizeDevice } from "../../utils/deviceMapper"

export async function deleteDeviceFromApi(
                                          deviceId: number,
                                          )
{
    console.log("deleteDevices")
    const token = localStorage.getItem("access_token")
    if (!token) {return}
    await fetch(
                        `${API_BASE_URL}/devices/${deviceId}`,
                        {
                          method: "DELETE",
                          headers: {
                                      Authorization:
                                        `Bearer ${token}`
                                    }
                        }
              )
}

