import { getHospitalManagementFromApi } from "../../hospitals/fetchHospitalManagement"
import { Dispatch, SetStateAction } from "react"
import { HospitalManagementType } from "../../../types/hospitalTypes"
import {normalizeHospitalManagement} from "../../../utils/hospitalMapper"

type FetchHospitalManagementTransactionParams = {setHospitals: Dispatch<SetStateAction<HospitalManagementType[]>>}

export async function fetchHospitalManagementTransaction({
                                                        setHospitals
                                                        }: FetchHospitalManagementTransactionParams) 
{
  console.log("fetchHospitalManagementTransaction")
  const hospitals =await getHospitalManagementFromApi()
  setHospitals(hospitals.map(normalizeHospitalManagement))
}