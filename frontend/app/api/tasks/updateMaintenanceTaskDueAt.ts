import { API_BASE_URL , } from "../client/apiClient"

import { UpdateMaintenanceTaskDueAt } from "../../types/taskTypes"
import { toUpdateMaintenanceTaskDueAtRequest } from "../../utils/taskMapper"

export async function updateMaintenanceTaskDueAt(task: UpdateMaintenanceTaskDueAt)
 {
    console.log("updateMaintenanceTaskDueAt")
    const response = await fetch(
                                        `${API_BASE_URL}/update-maintenance-task-due-at`,
                                        {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        credentials: "include",
                                        body: JSON.stringify(
                                            toUpdateMaintenanceTaskDueAtRequest(task)
                                        )
                                        }
    )
  return await response.json()
}