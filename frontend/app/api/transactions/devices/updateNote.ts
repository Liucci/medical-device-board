<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import {
         toUpdateNoteRequest
       } from "../../../utils/deviceMapper"
import { Device } from "../../../types/deviceTypes"
<<<<<<< HEAD
import { authFetch } from "../../client/apiClient"
=======
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

type Params = {
                device: Device
              }

export async function updateNote({
                                   device
                                 }: Params) {

    await authFetch(
                `${API_BASE_URL}/update-note`,
                {
                    method: "POST",
                    headers: {
                              "Content-Type":
                              "application/json"
                             },
                    body: JSON.stringify(
                                            toUpdateNoteRequest(
                                                                  device
                                                               )
                                        )
                }
              )
}