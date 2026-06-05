import { API_BASE_URL } from "../../client"
import { getDeviceTypesFromApi } from "../../deviceTypes/fetchDeviceTypes"
import { normalizeDeviceType } from "../../../utils/deviceTypeMapper"

type Props = {
                id:number
                name:string
                setDeviceTypes: React.Dispatch<React.SetStateAction<any[]>>
             }

export const updateDeviceTypeTransaction = async ({
                                                    id,
                                                    name,
                                                    setDeviceTypes
                                                  }: Props) => {

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}/update-device-type`,
                {
                  method:"POST",
                  headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${token}`
                          },
                  body:JSON.stringify({
                                          id,
                                          name
                                        })
                }
              )

  const deviceTypes = await getDeviceTypesFromApi()

  setDeviceTypes(
                  deviceTypes.map(normalizeDeviceType)
                )
}