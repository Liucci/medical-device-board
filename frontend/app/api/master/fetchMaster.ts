import { API_BASE_URL } from "../client"

export async function getMasterFromApi(

  setDeviceTypes: any,
  setDeviceModels: any

) {

  try {

    const token =
      localStorage.getItem(
        "access_token"
      )

    if (!token) {

      console.error(
        "token not found"
      )

      return
    }

    const response =
      await fetch(

        `${API_BASE_URL}/master`,

        {

          method: "GET",

          headers: {

            Authorization:
              `Bearer ${token}`
          }
        }
      )

    const data =
      await response.json()

    console.log(
      "master response:",
      data
    )

    if (!data.success) {

      console.error(
        data.error
      )

      return
    }

    setDeviceTypes(
      data.device_types
    )

    setDeviceModels(
      data.device_models
    )

  } catch (err) {

    console.error(
      "fetch master error:",
      err
    )
  }
}