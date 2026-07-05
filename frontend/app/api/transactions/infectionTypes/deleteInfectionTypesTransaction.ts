<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { DeleteInfectionTypesType } from "../../../types/infectionTypeTypes"
import { getInfectionTypesFromApi } from "../../infectionTypes/fetchInfectionTypes"
import {
         normalizeInfectionType,
         toDeleteInfectionTypesRequest
       } from "../../../utils/infectionTypeMapper"
<<<<<<< HEAD
import { authFetch } from "../../client/apiClient"
=======
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

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

  await authFetch(
                    `${API_BASE_URL}/delete-infection-types`,
                    {
                      method: "POST",
                      headers: {
                                  "Content-Type":
                                  "application/json"
                                },
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