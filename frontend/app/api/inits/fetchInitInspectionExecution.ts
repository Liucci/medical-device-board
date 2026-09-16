import { API_BASE_URL }from "../client/apiClient"

export const fetchInitInspectionExecution =async () => {

  const response =await fetch(`${API_BASE_URL}/inspection/init-inspection-execution`,
                                  {
                                    method: "GET",
                                    headers: {
                                            "Content-Type":
                                            "application/json"
                                    },
                                    credentials: "include",

                                  }
                                )

  const data =await response.json()

  return data
}