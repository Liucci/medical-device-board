import { API_BASE_URL } from "../../client/apiClient"
import { MaintenanceType } from "../../../types/maintenanceTypeTypes"
import { getMaintenanceTypesFromApi } from "../../maintenanceTypes/fetchMaintenanceTypes"
import { normalizeMaintenanceType,toUpdateMaintenanceTypeRequest } from "../../../utils/maintenanceTypeMapper"
import { authFetch } from "../../client/apiClient"

type UpdateMaintenanceTypeTransactionParams = {
                                                maintenanceType: MaintenanceType
                                                setMaintenanceTypes: any
                                              }

export async function updateMaintenanceTypeTransaction({
                                                         maintenanceType,
                                                         setMaintenanceTypes
                                                       }: UpdateMaintenanceTypeTransactionParams
                                                     )
{
  console.log("updateMaintenanceTypeTransaction")

  await authFetch(
                `${API_BASE_URL}/update-maintenance-type`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
                            },
                  body: JSON.stringify(
                                          toUpdateMaintenanceTypeRequest(
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
}