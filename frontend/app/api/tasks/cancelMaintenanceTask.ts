<<<<<<< HEAD
import { API_BASE_URL,authFetch } from "../client/apiClient"
=======
import { API_BASE_URL,authFetch } from "../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

import { CancelMaintenanceTask } from "../../types/taskTypes"
import { toCancelMaintenanceTaskRequest } from "../../utils/taskMapper"

export async function cancelMaintenanceTask(task: CancelMaintenanceTask)
 {
  console.log("cancelMaintenanceTask")
  const response = await authFetch(
                                    `${API_BASE_URL}/cancel-maintenance-task`,
                                    {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(
                                        toCancelMaintenanceTaskRequest(task)
                                    )
                                    }
  )

  return await response.json()
}