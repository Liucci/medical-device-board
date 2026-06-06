import { API_BASE_URL } from "../../client"
import { MaintenanceType } from "../../../types/maintenanceTypeTypes"
import { getMaintenanceTypesFromApi } from "../../maintenanceTypes/fetchMaintenanceTypes"
import { normalizeMaintenanceType,toUpdateMaintenanceTypeRequest } from "../../../utils/maintenanceTypeMapper"

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

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}/update-maintenance-type`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
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