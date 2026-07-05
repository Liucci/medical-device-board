<<<<<<< HEAD
import { API_BASE_URL , authFetch} from "../client/apiClient"
=======
import { API_BASE_URL , authFetch} from "../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

import { UpdateMaintenanceTaskDueAt } from "../../types/taskTypes"
import { toUpdateMaintenanceTaskDueAtRequest } from "../../utils/taskMapper"

export async function updateMaintenanceTaskDueAt(task: UpdateMaintenanceTaskDueAt)
 {
    console.log("updateMaintenanceTaskDueAt")
    const response = await authFetch(
                                        `${API_BASE_URL}/update-maintenance-task-due-at`,
                                        {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(
                                            toUpdateMaintenanceTaskDueAtRequest(task)
                                        )
                                        }
    )
  return await response.json()
}