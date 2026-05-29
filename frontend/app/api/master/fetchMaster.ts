import { API_BASE_URL } from "../client"

import {
        normalizeDeviceType,
        normalizeDeviceModel
        } from "../../utils/masterMapper"

export async function getDeviceTypesFromApi(
                                       setDeviceTypes: any
                                       )
{
    console.log("fetchDeviceTypes")

    const token = localStorage.getItem("access_token")
    if (!token) {return}

    const response = await fetch(
                        `${API_BASE_URL}/master`,
                        {
                          method: "GET",
                          headers: {
                                      Authorization:
                                        `Bearer ${token}`
                                    }
                        }
                      )

    const data = await response.json()

    setDeviceTypes(
      data.device_types.map(normalizeDeviceType)
    )
}

export async function getDeviceModelsFromApi(
                                        setDeviceModels: any
                                        )
{
    console.log("fetchDeviceModels")

    const token = localStorage.getItem("access_token")
    if (!token) {return}

    const response = await fetch(
                        `${API_BASE_URL}/master`,
                        {
                          method: "GET",
                          headers: {
                                      Authorization:
                                        `Bearer ${token}`
                                    }
                        }
                      )

    const data = await response.json()

    setDeviceModels(
      data.device_models.map(normalizeDeviceModel)
    )
}