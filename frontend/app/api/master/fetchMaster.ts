import { API_BASE_URL } from "../client"

import {
        normalizeDeviceType,
        normalizeDeviceModel
        } from "../../utils/masterMapper"

export async function getDeviceTypesFromApi()
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
    return await response.json()

}

export async function getDeviceModelsFromApi()
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

    return await response.json()

    
}