import { getTasksFromApi } from "../../tasks/fetchTasks"
import { normalizeMaintenanceTask } from "../../../utils/taskMapper"
import { cancelMaintenanceTask } from "../../tasks/cancelMaintenanceTask"

import { CancelMaintenanceTask } from "../../../types/taskTypes"

type Params = {
  task: CancelMaintenanceTask
  setTasks: React.Dispatch<React.SetStateAction<any[]>>
}

export async function cancelMaintenanceTaskTransaction({
  task,
  setTasks
}: Params) {

  await cancelMaintenanceTask(task)

  const tasks = await getTasksFromApi()

  setTasks(
    tasks.map(normalizeMaintenanceTask)
  )
}