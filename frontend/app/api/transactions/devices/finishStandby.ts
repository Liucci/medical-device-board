<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
import {
         toFinishStandbyRequest
       } from "../../../utils/deviceMapper"
import { authFetch } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
import {
         toFinishStandbyRequest
       } from "../../../utils/deviceMapper"
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

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