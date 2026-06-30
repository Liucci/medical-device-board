import { getTasksFromApi } from "../../tasks/fetchTasks"
import { normalizeMaintenanceTask } from "../../../utils/taskMapper"
import { updateMaintenanceTaskDueAt } from "../../tasks/updateMaintenanceTaskDueAt"

import { UpdateMaintenanceTaskDueAt } from "../../../types/taskTypes"

type Params = {
  task: UpdateMaintenanceTaskDueAt
  setTasks: React.Dispatch<React.SetStateAction<any[]>>
}

export async function updateMaintenanceTaskDueAtTransaction({
  task,
  setTasks
}: Params) {

  await updateMaintenanceTaskDueAt(task)

  const tasks = await getTasksFromApi()

  setTasks(
    tasks.map(normalizeMaintenanceTask)
  )
}