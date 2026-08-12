import { API_BASE_URL } from "../../client/apiClient"
import { DeleteInfectionTypesType } from "../../../types/infectionTypeTypes"
import { getInfectionTypesFromApi } from "../../infectionTypes/fetchInfectionTypes"
import {
         normalizeInfectionType,
         toDeleteInfectionTypesRequest
       } from "../../../utils/infectionTypeMapper"
import {  } from "../../client/apiClient"

type DeleteInfectionTypesTransactionParams = {
                                                infectionTypes: DeleteInfectionTypesType
                                                setInfectionTypes: any
                                             }

export async function deleteInfectionTypesTransaction({
                                                        infectionTypes,
                                                        setInfectionTypes
                                                      }: DeleteInfectionTypesTransactionParams
                                                    )
{
  console.log("deleteInfectionTypesTransaction")

  await fetch(
                    `${API_BASE_URL}/delete-infection-types`,
                    {
                      method: "POST",
                      headers: {
                                  "Content-Type":
                                  "application/json"
                                },
                      credentials: "include",
                      body: JSON.stringify(
                                              toDeleteInfectionTypesRequest(
                                                                              infectionTypes
                                                                            )
                                            )
                    }
                  )

  const infectionTypesResponse =
    await getInfectionTypesFromApi()

  setInfectionTypes(
                      infectionTypesResponse.map(
                                                   normalizeInfectionType
                                                 )
                    )
}