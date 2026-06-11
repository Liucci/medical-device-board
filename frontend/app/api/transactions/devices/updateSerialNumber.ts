import { API_BASE_URL } from "../../client"
import {
         toUpdateSerialNumberRequest
       } from "../../../utils/deviceMapper"
import { Device } from "../../../types/deviceTypes"

type Params = {
                device: Device
              }

export async function updateSerialNumber({
                                            device
                                         }: Params) {

    const token = localStorage.getItem("access_token")

    if (!token) {
        return
    }

    await fetch(
                `${API_BASE_URL}/update-serial-number`,
                {
                    method: "POST",
                    headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`
                             },
                    body: JSON.stringify(
                                            toUpdateSerialNumberRequest(
                                                                           device
                                                                         )
                                        )
                }
              )
}/*  */