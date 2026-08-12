import { API_BASE_URL, } from "../client/apiClient"

import { CancelMaintenanceTask } from "../../types/taskTypes"
import { toCancelMaintenanceTaskRequest } from "../../utils/taskMapper"

export async function cancelMaintenanceTask(task: CancelMaintenanceTask)
 {
  console.log("cancelMaintenanceTask")
  const response = await fetch(
                                    `${API_BASE_URL}/cancel-maintenance-task`,
                                    {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    credentials: "include",
                                    body: JSON.stringify(
                                        toCancelMaintenanceTaskRequest(task)
                                    )
                                    }
  )

  return await response.json()
}