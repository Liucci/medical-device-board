import { API_BASE_URL } from "../../client"
import { getMaintenanceTypesFromApi } from "../../maintenanceTypes/fetchMaintenanceTypes"
import { normalizeMaintenanceType,toDeleteMaintenanceTypesRequest } from "../../../utils/maintenanceTypeMapper"

type DeleteMaintenanceTypesTransactionParams = {
                                                 ids: number[]
                                                 setMaintenanceTypes: any
                                               }

export async function deleteMaintenanceTypesTransaction({
                                                          ids,
                                                          setMaintenanceTypes
                                                        }: DeleteMaintenanceTypesTransactionParams
                                                      )
{
  console.log("deleteMaintenanceTypesTransaction")

  const token = localStorage.getItem("access_token")
  if (!token) {return}

  await fetch(
                `${API_BASE_URL}/delete-maintenance-types`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
                            },
                  body: JSON.stringify(
                                          toDeleteMaintenanceTypesRequest(
                                                                              ids
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