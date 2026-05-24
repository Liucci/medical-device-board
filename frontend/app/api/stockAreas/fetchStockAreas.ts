import { API_BASE_URL } from "../client"
import { normalizeStockArea} from "../../utils/stockAreaMapper"

export async function getStockAreasFromApi(

  setStockAreas: any

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

        `${API_BASE_URL}/stock-areas`,

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
      "stock areas response:",
      data
    )

    if (!data.success) {

      console.error(
        data.error
      )

      return
    }

    setStockAreas(
      data.stock_areas.map(normalizeStockArea)
    )

  } catch (err) {

    console.error(
      "fetch stock areas error:",
      err
    )
  }
}