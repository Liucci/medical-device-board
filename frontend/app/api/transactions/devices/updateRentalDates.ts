import { API_BASE_URL } from "../../client/apiClient"
import {
         toUpdateDeviceRentalDatesRequest
       } from "../../../utils/deviceMapper"
import { Device } from "../../../types/deviceTypes"
import {  } from "../../client/apiClient"

type Params = {
                device: Device
              }

export async function updateRentalDates({
                                           device
                                         }: Params) {

    await fetch(
                      `${API_BASE_URL}/update-device-rental-dates`,
                      {
                        method: "POST",
                        headers: {
                                    "Content-Type":
                                    "application/json"
                                  },
                        credentials: "include",
                        body: JSON.stringify(
                                              toUpdateDeviceRentalDatesRequest(
                                                                                 device
                                                                               )
                                            )
                      }
                    )
}