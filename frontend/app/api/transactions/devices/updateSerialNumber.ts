import { API_BASE_URL } from "../../client/apiClient"
import {toUpdateSerialNumberRequest} from "../../../utils/deviceMapper"
import { Device } from "../../../types/deviceTypes"
import { authFetch } from "../../client/apiClient"

type Params = {
                device: Device
              }

export async function updateSerialNumber({
                                            device
                                         }: Params) {
    await fetch(
                `${API_BASE_URL}/update-serial-number`,
                {
                    method: "POST",
                    headers: {
                              "Content-Type":
                              "application/json"
                             },
                    credentials: "include",
                    body: JSON.stringify(
                                            toUpdateSerialNumberRequest(
                                                                           device
                                                                         )
                                        )
                }
              )
}