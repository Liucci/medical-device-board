import { API_BASE_URL } from "../client"
import { normalizeRoom} from "../../utils/roomsMapper"


export async function getRoomsFromApi(

  setRooms: any

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

        `${API_BASE_URL}/rooms`,

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
      "rooms response:",
      data
    )

    if (!data.success) {

      console.error(
        data.error
      )

      return
    }

    setRooms(
      data.rooms.map(normalizeRoom)
    )

  } catch (err) {

    console.error(
      "fetch rooms error:",
      err
    )
  }
}