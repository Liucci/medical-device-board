import { API_BASE_URL } from "../../client/apiClient"
import { supabase } from "../../lib/supabase"
export const refreshToken = async (): Promise<boolean> => {
  const refreshTokenValue =localStorage.getItem("refresh_token")
  if (!refreshTokenValue) {return false}
try {
  console.log("refreshToken")
  console.trace("[REFRESH]")

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
  if (!response.ok) {
    console.error("refresh failed", response.status)
    return false
  }
  const data = await response.json()
  localStorage.setItem( "access_token",data.access_token)
  localStorage.setItem("refresh_token",data.refresh_token)
  console.log( "[SAVED ACCESS TOKEN]",localStorage.getItem("access_token")?.slice(0, 12))
  console.log("[SAVED REFRESH TOKEN]",localStorage.getItem("refresh_token")?.slice(0, 12))  
  await supabase.realtime.setAuth(data.access_token)
  console.log("[Realtime Auth Set]")
  return true
  }
  catch(error){
    console.error("refresh failed", error)
    return false
  }                         
}