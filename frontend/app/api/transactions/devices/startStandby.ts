import { API_BASE_URL } from "../../client"
import {
         toStartStandbyRequest
       } from "../../../utils/deviceMapper"
import { authFetch } from "../../client"

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