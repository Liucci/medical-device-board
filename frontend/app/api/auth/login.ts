import {API_BASE_URL} from "../client"

//backendの/loginを呼び出す
export async function login(
                              email: string,
                              password: string
                            ) 
{
  const response = await fetch(
                        `${API_BASE_URL}/login`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type":
                                    "application/json"
                                  },
                                  body: JSON.stringify({
                                    email,
                                    password
                                  })
                                }
                      )

  return await response.json()
}