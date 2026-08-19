import { useState } from "react"
import { getHospitalManagementFromApi } from "../../hospitals/fetchHospitalManagement"
import { Dispatch, SetStateAction } from "react"
import { HospitalManagementType } from "../../../types/hospitalTypes"
import {normalizeHospitalManagement} from "../../../utils/hospitalMapper"
import { executeWithErrorAndLoading } from "../../../components/common/executeWithErrorAndLoading"

type FetchHospitalManagementTransactionParams = {
  setHospitals: Dispatch<SetStateAction<HospitalManagementType[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export async function fetchHospitalManagementTransaction({
    setHospitals,
    setLoading,
}: FetchHospitalManagementTransactionParams) {

    console.log("fetchHospitalManagementTransaction")

    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {

            const hospitals = await getHospitalManagementFromApi()

            setHospitals(
                hospitals.map(normalizeHospitalManagement)
            )
        },
    })
}