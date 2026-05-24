import { API_BASE_URL } from "../client"

export async function getTasksFromApi(

  setTasks: any

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

        `${API_BASE_URL}/tasks`,

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
      "tasks response:",
      data
    )

    if (!data.success) {

      console.error(
        data.error
      )

      return
    }

    setTasks(
      data.tasks
    )

  } catch (err) {

    console.error(
      "fetch tasks error:",
      err
    )
  }
}