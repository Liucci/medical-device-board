import { API_BASE_URL } from "../client"
import { Device } from "../../types/deviceTypes"
import { normalizeDevice, toDBDevice } from "../../utils/deviceMapper"
//作成したが純粋なaddDeviceは不要か？
export async function addDeviceFromApi(
                                        params: Device
                                      ) 
{
console.log("addDevices")
  const token =localStorage.getItem("access_token")
  if (!token) {return}
  await fetch(
              `${API_BASE_URL}/devices`,
              {
                method: "POST",
                headers: {
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${token}`
                          },
                body: JSON.stringify(toDBDevice(params))
              }
  )
}