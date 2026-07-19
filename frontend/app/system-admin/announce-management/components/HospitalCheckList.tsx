"use client"

import { HospitalManagementType } from "../../../types/hospitalTypes"

type HospitalCheckListProps = {
    hospitals: HospitalManagementType[]
    selectedHospitalIds: string[]
    setSelectedHospitalIds: any
}

export default function HospitalCheckList({
    hospitals,
    selectedHospitalIds,
    setSelectedHospitalIds
}: HospitalCheckListProps)
{
    console.log(hospitals)
    const isAllSelected = selectedHospitalIds.length === 0

    const toggleAll = () => {
        setSelectedHospitalIds([])
    }

    const toggleHospital = (hospitalId: string) => {

        if (selectedHospitalIds.includes(hospitalId)) {

            setSelectedHospitalIds(
                selectedHospitalIds.filter(
                    id => id !== hospitalId
                )
            )

            return
        }

        setSelectedHospitalIds([
            ...selectedHospitalIds,
            hospitalId
        ])
    }

    return (
        <div className="rounded border p-3">

            <label className="mb-3 flex items-center gap-2 border-b pb-2 font-semibold">

                <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleAll}
                />

                全病院

            </label>

            <div className="max-h-60 overflow-y-auto">

                {
                    hospitals.map((hospital) => (

                        <label
                            key={hospital.id}
                            className="flex items-center gap-2 py-1"
                        >

                            <input
                                type="checkbox"
                                checked={
                                    !isAllSelected &&
                                    selectedHospitalIds.includes(
                                        hospital.id
                                    )
                                }
                                disabled={isAllSelected}
                                onChange={() =>
                                    toggleHospital(
                                        hospital.id
                                    )
                                }
                            />

                            {hospital.hospitalName}

                        </label>

                    ))
                }

            </div>

        </div>
    )
}