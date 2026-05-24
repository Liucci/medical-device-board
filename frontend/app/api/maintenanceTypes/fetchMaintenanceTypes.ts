import { API_BASE_URL } from "../client"

export async function getMaintenanceTypesFromApi(

  setMaintenanceTypes: any

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

        `${API_BASE_URL}/maintenance-types`,

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
      "maintenance types response:",
      data
    )

    if (!data.success) {

      console.error(
        data.error
      )

      return
    }

    setMaintenanceTypes(
      data.maintenance_types
    )

  } catch (err) {

    console.error(
      "fetch maintenance types error:",
      err
    )
  }
}