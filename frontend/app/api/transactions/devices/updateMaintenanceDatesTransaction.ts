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

    await authFetch(
                      `${API_BASE_URL}/update-maintenance-dates`,
                      {
                        method: "POST",
                        headers: {
                                    "Content-Type":
                                    "application/json"
                                  },
                        body: JSON.stringify(
                                              toUpdateMaintenanceDatesRequest(
                                                                                   device
                                                                                 )
                                            )
                      }
                    )
}