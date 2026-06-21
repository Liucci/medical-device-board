import { API_BASE_URL } from "../../client"
import {
         toFinishStandbyRequest
       } from "../../../utils/deviceMapper"
import { authFetch } from "../../client"

export async function finishStandby(
                                      id: number
                                    ) {

    await authFetch(
                `${API_BASE_URL}/finish-standby`,
                {
                    method: "POST",
                    headers: {
                "Content-Type":
                "application/json"
                             },
                    body: JSON.stringify(
                                            toFinishStandbyRequest(
                                                                     id
                                                                   )
                                        )
                }
              )
}