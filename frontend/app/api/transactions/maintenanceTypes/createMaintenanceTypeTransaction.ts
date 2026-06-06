import { API_BASE_URL } from "../../client"
import { MaintenanceType } from "../../../types/maintenanceTypeTypes"
import { getMaintenanceTypesFromApi } from "../../maintenanceTypes/fetchMaintenanceTypes"
import { normalizeMaintenanceType,toCreateMaintenanceTypeRequest } from "../../../utils/maintenanceTypeMapper"

type CreateMaintenanceTypeTransactionParams = {
                                                maintenanceType: MaintenanceType
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

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}/maintenance-types`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
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