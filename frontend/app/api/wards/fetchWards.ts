import { API_BASE_URL } from "../client"
import { normalizeWard} from "../../utils/wardsMapper"

export async function getWardsFromApi(

  setWards: any

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

        `${API_BASE_URL}/wards`,

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
      "wards response:",
      data
    )

    if (!data.success) {

      console.error(
        data.error
      )

      return
    }

    setWards(
      data.wards.map(normalizeWard)
    )

  } catch (err) {

    console.error(
      "fetch wards error:",
      err
    )
  }
}