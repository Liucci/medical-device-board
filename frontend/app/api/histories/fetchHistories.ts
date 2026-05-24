import { API_BASE_URL } from "../client"

export async function getHistoriesFromApi(

  setHistories: any

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

        `${API_BASE_URL}/histories`,

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
      "histories response:",
      data
    )

    if (!data.success) {

      console.error(
        data.error
      )

      return
    }

    setHistories(
      data.histories
    )

  } catch (err) {

    console.error(
      "fetch histories error:",
      err
    )
  }
}