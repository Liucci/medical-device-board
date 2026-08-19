import { API_BASE_URL } from "../client/apiClient"

export const refreshToken = async (): Promise<string | null> => {
try {
        console.log("refreshToken")

        const response =await fetch(
                                    `${API_BASE_URL}/refresh-token`,
                                    {
                                      method: "POST",
                                      credentials: "include",
                                    }
                                  )
        if (!response.ok) {
          console.error("refresh failed", response.status)
          return  null
        }
        const data = await response.json()
        return data.access_token
    }
catch(error){
    console.error("refresh failed", error)
    return null
  }                         
}