import { API_BASE_URL } from "../client"

export const refreshToken = async () => {
  console.log("API_BASE_URL", API_BASE_URL)
  const refreshTokenValue =localStorage.getItem("refresh_token")

    console.log(
    "[REFRESH BEFORE]",
    refreshTokenValue?.slice(0, 12)
  )

  if (!refreshTokenValue) {return null}
try {
  console.log("refresh start")
  const response =await fetch(
                              `${API_BASE_URL}/refresh-token`,
                              {
                                method: "POST",
                                headers: {
                                            "Content-Type":"application/json"
                                          },
                                body: JSON.stringify({
                                                        refresh_token: refreshTokenValue
                                                      })
                              }
                            )
  
  console.log("refresh response", response.status)
    if (!response.ok) {
      console.error("refresh failed", response.status)
      return null
    }

  const data = await response.json()
  localStorage.setItem( "access_token",data.access_token)
  localStorage.setItem("refresh_token",data.refresh_token)
    console.log(
      "[REFRESH RESPONSE]",
      data.refresh_token.slice(0, 12)
    )
    console.log(
          "[REFRESH AFTER]",
          localStorage.getItem("refresh_token")?.slice(0, 12)
    )


  return data

  }
  catch(error){
    console.error("refresh failed", error)
    console.log(
      "refresh token used",
      refreshTokenValue
    )
    return null
  }                         
}