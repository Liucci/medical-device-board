import { API_BASE_URL } from "../../client"
import { getTasksFromApi }from "../../tasks/fetchTasks"
import {
         normalizeMaintenanceTask,
         toCompleteMaintenanceTaskRequest
       } from "../../../utils/taskMapper"

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

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}/complete_maintenance_task`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
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