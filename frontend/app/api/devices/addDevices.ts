import { API_BASE_URL } from "../client"
import { Device } from "../../types/deviceTypes"
import { toDBDevice } from "../../utils/deviceMapper"

type AddDeviceParams = Omit<
                              Device,
                              | "id"
                              >

export async function addDeviceFromApi(params: AddDeviceParams) 
{
console.log("addDevices")
  const token =localStorage.getItem("access_token")
  if (!token) {return}
  const response = await fetch(
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
  //backからのJSONを受け取る
  return await response.json()
}