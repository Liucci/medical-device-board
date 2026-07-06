import { API_BASE_URL } from "../../client/apiClient"
import {
         toUpdateDeviceRentalDatesRequest
       } from "../../../utils/deviceMapper"
import { Device } from "../../../types/deviceTypes"
import { authFetch } from "../../client/apiClient"

type Params = {
                device: Device
              }

export async function updateRentalDates({
                                           device
                                         }: Params) {

    await authFetch(
                      `${API_BASE_URL}/update-device-rental-dates`,
                      {
                        method: "POST",
                        headers: {
                                    "Content-Type":
                                    "application/json"
                                  },
                        body: JSON.stringify(
                                              toUpdateDeviceRentalDatesRequest(
                                                                                 device
                                                                               )
                                            )
                      }
                    )
}