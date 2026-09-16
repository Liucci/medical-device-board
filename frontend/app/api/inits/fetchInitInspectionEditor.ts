import { API_BASE_URL }from "../client/apiClient"

export const fetchInitInspectionEditor =async () => {

  const response =await fetch(`${API_BASE_URL}/init-inspection-editor`,
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