import { API_BASE_URL } from "../client"
import { normalizeDevice} from "../../utils/deviceMapper"


export async function getDevicesFromApi(

  setDeviceList: any

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

        `${API_BASE_URL}/devices`,

        {

          method: "GET",

          headers: {

            Authorization:
              `Bearer ${token}`
          }
        }
      )
    console.log( "API_BASE_URL:",API_BASE_URL)

    const data =
      await response.json()

    console.log(
      "devices api response:",
      data
    )
    setDeviceList(
      data.map(normalizeDevice)
    )

  } catch (err) {

    console.error(
      "fetch devices error:",
      err
    )
  }
}