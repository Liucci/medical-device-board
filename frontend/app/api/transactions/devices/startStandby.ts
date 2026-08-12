import { API_BASE_URL } from "../../client/apiClient"
import {
         toStartStandbyRequest
       } from "../../../utils/deviceMapper"
import {  } from "../../client/apiClient"

export async function startStandby(
                                     id: number
                                   ) {


    await fetch(
                `${API_BASE_URL}/start-standby`,
                {
                    method: "POST",
                    headers: {
                              "Content-Type":
                              "application/json"
                             },
                    credentials: "include",
                    body: JSON.stringify(
                                            toStartStandbyRequest(
                                                                    id
                                                                  )
                                        )
                }
              )
}