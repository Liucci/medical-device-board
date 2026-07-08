import { getHospitalManagementFromApi } from "../../hospitals/fetchHospitalManagement"

import {
  normalizeHospitalManagement
} from "../../../utils/hospitalMapper"

type FetchHospitalManagementTransactionParams = {
                                                setHospitals: any
                                                }

export async function fetchHospitalManagementTransaction({
                                                        setHospitals
                                                        }: FetchHospitalManagementTransactionParams) {

  console.log("fetchHospitalManagementTransaction")

  const hospitals =await getHospitalManagementFromApi()

  setHospitals(hospitals.map(
                                normalizeHospitalManagement
                                )
  )
}