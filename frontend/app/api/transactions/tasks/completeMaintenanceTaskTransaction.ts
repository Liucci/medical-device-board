import { API_BASE_URL } from "../../client/apiClient"
import { getTasksFromApi }from "../../tasks/fetchTasks"
import {
         normalizeMaintenanceTask,
         toCompleteMaintenanceTaskRequest
       } from "../../../utils/taskMapper"
import { authFetch } from "../../client/apiClient"
import { CompleteMaintenanceTask } from "../../../types/taskTypes"

type Params = {
                task: CompleteMaintenanceTask
                setTasks: React.Dispatch<React.SetStateAction<any[]>>
              }

export async function completeMaintenanceTaskTransaction({
                                                           task,
                                                           setTasks
                                                         }:Params
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
                      task
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