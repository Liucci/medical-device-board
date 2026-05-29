import { API_BASE_URL } from "../client"
import { Device } from "../../types/deviceTypes"
import { toDBDevice } from "../../utils/deviceMapper"

type RenameDeviceParams = {
                            id: Device["id"]
                          }

export async function renameDeviceFromApi(
                                           params: RenameDeviceParams
                                           )
{
    console.log("renameDevices")

    const token = localStorage.getItem("access_token")

    if (!token) {return}

    const response = await fetch(
                        `${API_BASE_URL}/devices/${params.id}`,
                        {
                          method: "PATCH",

                          headers: {
                                      "Content-Type":"application/json",
                                      Authorization:
                                        `Bearer ${token}`
                                    },

                          body: JSON.stringify({
                                                  id: params.id
                                                })
                        }
                      )

    return await response.json()
}