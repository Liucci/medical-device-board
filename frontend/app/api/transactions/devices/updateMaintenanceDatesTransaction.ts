import { API_BASE_URL } from "../../client/apiClient"
import {
         toUpdateMaintenanceDatesRequest
       } from "../../../utils/deviceMapper"
import { Device } from "../../../types/deviceTypes"
import { authFetch } from "../../client/apiClient"

type Params = {
                device: Device
              }

export async function updateMaintenanceDatesTransaction({
                                                    device
                                                  }: Params) {

    await fetch(
                      `${API_BASE_URL}/update-maintenance-dates`,
                      {
                        method: "POST",
                        headers: {
                                    "Content-Type":
                                    "application/json"
                                  },
                        credentials: "include",
                        body: JSON.stringify(
                                              toUpdateMaintenanceDatesRequest(
                                                                                   device
                                                                                 )
                                            )
                      }
                    )
}