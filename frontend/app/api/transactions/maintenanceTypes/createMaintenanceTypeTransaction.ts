<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
import { CreateMaintenanceType } from "../../../types/maintenanceTypeTypes"
import { getMaintenanceTypesFromApi } from "../../maintenanceTypes/fetchMaintenanceTypes"
import { normalizeMaintenanceType,toCreateMaintenanceTypeRequest } from "../../../utils/maintenanceTypeMapper"
import { authFetch } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
import { CreateMaintenanceType } from "../../../types/maintenanceTypeTypes"
import { getMaintenanceTypesFromApi } from "../../maintenanceTypes/fetchMaintenanceTypes"
import { normalizeMaintenanceType,toCreateMaintenanceTypeRequest } from "../../../utils/maintenanceTypeMapper"
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

type CreateMaintenanceTypeTransactionParams = {
                                                maintenanceType: CreateMaintenanceType
                                                setMaintenanceTypes: any
                                                onClose?: () => void
                                              }

export async function createMaintenanceTypeTransaction({
                                                         maintenanceType,
                                                         setMaintenanceTypes,
                                                         onClose
                                                       }: CreateMaintenanceTypeTransactionParams
                                                     )
{
  console.log("createMaintenanceTypeTransaction")

  await authFetch(
                `${API_BASE_URL}/maintenance-types`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
                            },
                  body: JSON.stringify(
                                          toCreateMaintenanceTypeRequest(
                                                                            maintenanceType
                                                                          )
                                        )
                }
              )

  const maintenanceTypes =
    await getMaintenanceTypesFromApi()

  setMaintenanceTypes(
                        maintenanceTypes.map(
                                              normalizeMaintenanceType
                                            )
                      )

  if (onClose) {onClose()}
}