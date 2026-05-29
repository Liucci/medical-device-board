import { API_BASE_URL } from "../client"

export async function getHistoriesFromApi(setHistories: any)
 {
    console.log("fetchHistories")
    const token =localStorage.getItem("access_token")
    if (!token) {return}
    const response = await fetch(
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
    setHistories(data)
}