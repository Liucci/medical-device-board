import { API_BASE_URL } from "../../../client/apiClient"
import { getMaintenanceTypesFromApi } from "../../maintenanceTypes/fetchMaintenanceTypes"
import { normalizeMaintenanceType,toDeleteMaintenanceTypesRequest } from "../../../utils/maintenanceTypeMapper"
import { authFetch } from "../../../client/apiClient"

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

  await authFetch(
                `${API_BASE_URL}/delete-maintenance-types`,
                {
                  method: "POST",
                  headers: {
                            "Content-Type":
                            "application/json"
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