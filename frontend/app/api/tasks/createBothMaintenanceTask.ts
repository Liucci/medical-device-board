import { API_BASE_URL } from "../client/apiClient"

import { CreateBothMaintenanceTask } from "../../types/taskTypes"
import { toCreateBothMaintenanceTaskRequest } from "../../mapper/taskMapper"

export async function createBothMaintenanceTask(task: CreateBothMaintenanceTask)
{
  console.log("createBothMaintenanceTask")

  const response = await fetch(
                                    `${API_BASE_URL}/create-both-maintenance-task`,
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json"
                                      },
                                      credentials: "include",
                                      body: JSON.stringify(
                                        toCreateBothMaintenanceTaskRequest(task)
                                      )
                                    }
                                  )

  return await response.json()
}