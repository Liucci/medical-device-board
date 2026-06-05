import { normalizeDeviceType } from "../../../utils/deviceTypeMapper"
import { API_BASE_URL } from "../../client"
import { getDeviceTypesFromApi } from "../../deviceTypes/fetchDeviceTypes"

export async function createDeviceTypeTransaction(
                                                    name:string,
                                                    setNewDeviceTypeName:any,
                                                    setDeviceTypes:any
                                                  )
{
    console.log("createDeviceTypeTransaction")

    const trimmed = name.trim()
    if (!trimmed) {return}

    const token = localStorage.getItem("access_token")
    if (!token) {return}

    await fetch(
                  `${API_BASE_URL}/device-types`,
                  {
                    method:"POST",
                    headers:{
                                "Content-Type":"application/json",
                                "Authorization":`Bearer ${token}`
                              },
                    body:JSON.stringify({
                                            name:trimmed
                                          })
                  }
                )

    const deviceTypes = await getDeviceTypesFromApi()
    setDeviceTypes(deviceTypes.map(normalizeDeviceType))
    setNewDeviceTypeName("")
}