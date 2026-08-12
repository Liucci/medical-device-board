import { API_BASE_URL } from "../../client/apiClient"
import {
         toUpdateNoteRequest
       } from "../../../utils/deviceMapper"
import { Device } from "../../../types/deviceTypes"
import { authFetch } from "../../client/apiClient"

type Params = {
                device: Device
              }

export async function updateNote({
                                   device
                                 }: Params) {

    await fetch(
                `${API_BASE_URL}/update-note`,
                {
                    method: "POST",
                    headers: {
                              "Content-Type":
                              "application/json"
                             },
                    credentials: "include",
                    body: JSON.stringify(
                                            toUpdateNoteRequest(
                                                                  device
                                                               )
                                        )
                }
              )
}