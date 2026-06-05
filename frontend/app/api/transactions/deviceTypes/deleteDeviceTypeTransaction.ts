import { API_BASE_URL } from "../../client"
import { normalizeDeviceType } from "../../../utils/deviceTypeMapper"
import { getDeviceTypesFromApi } from "../../deviceTypes/fetchDeviceTypes"

export async function deleteDeviceTypeTransaction(
                                                    id:number,
                                                    setDeviceTypes:any
                                                  )
{
    console.log("deleteDeviceTypeTransaction")

    if (
          !confirm(
                    "機種を削除すると紐づく機種モデルも削除されます。よろしいですか？"
                  )
       ) {return}

    const token = localStorage.getItem("access_token")
    if (!token) {return}

    await fetch(
                  `${API_BASE_URL}/delete-device-type`,
                  {
                    method:"POST",
                    headers:{
                                "Content-Type":"application/json",
                                "Authorization":`Bearer ${token}`
                              },
                    body:JSON.stringify({id})
                  }
                )

    const deviceTypes = await getDeviceTypesFromApi()
    setDeviceTypes(deviceTypes.map(normalizeDeviceType))
}