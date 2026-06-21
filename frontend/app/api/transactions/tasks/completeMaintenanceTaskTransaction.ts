import { API_BASE_URL } from "../../client"
import { getTasksFromApi }from "../../tasks/fetchTasks"
import {
         normalizeMaintenanceTask,
         toCompleteMaintenanceTaskRequest
       } from "../../../utils/taskMapper"
import { authFetch } from "../../client"

type CompleteMaintenanceTaskTransactionParams = {
                                                  id: number
                                                  setTasks: any
                                                }

export async function completeMaintenanceTaskTransaction({
                                                           id,
                                                           setTasks
                                                         }: CompleteMaintenanceTaskTransactionParams
                                                       )
{
  console.log("completeMaintenanceTaskTransaction")

  await authFetch(
                `${API_BASE_URL}/complete_maintenance_task`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
                            },
                  body: JSON.stringify(
                                          toCompleteMaintenanceTaskRequest(
                                                                             id
                                                                           )
                                        )
                }
              )

  const tasks =
    await getTasksFromApi()

  setTasks(
             tasks.map(
                        normalizeMaintenanceTask
                      )
           )
}