import { API_BASE_URL } from "../../client/apiClient"
import {
         toStartStandbyRequest
       } from "../../../utils/deviceMapper"
import { authFetch } from "../../client/apiClient"

export async function startStandby(
                                     id: number
                                   ) {


    await authFetch(
                `${API_BASE_URL}/start-standby`,
                {
                    method: "POST",
                    headers: {
                              "Content-Type":
                              "application/json"
                             },
                    body: JSON.stringify(
                                            toStartStandbyRequest(
                                                                    id
                                                                  )
                                        )
                }
              )
}