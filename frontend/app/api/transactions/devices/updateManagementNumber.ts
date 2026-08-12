import { API_BASE_URL } from "../../client/apiClient"
import {
         toUpdateManagementNumberRequest
       } from "../../../utils/deviceMapper"
import { Device } from "../../../types/deviceTypes"
import {  } from "../../client/apiClient"

type Params = {device: Device}

export async function updateManagementNumber({device}: Params) 
{

    await fetch(
                `${API_BASE_URL}/update-management-number`,
                {
                    method: "POST",
                    headers: {
                              "Content-Type":
                              "application/json"
                             },
                    credentials: "include",
                    body: JSON.stringify(
                                            toUpdateManagementNumberRequest(
                                                                               device
                                                                             )
                                        )
                }
              )
}