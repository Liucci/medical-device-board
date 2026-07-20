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

    const selectAll = () => {

        setSelectedHospitalIds(
            hospitals.map(hospital => hospital.id)
        )

    }

    const clearAll = () => {

        setSelectedHospitalIds([])

    }

    return (

        <div className="rounded border p-3">

            <div className="mb-3 flex gap-2">

                <button
                    type="button"
                    onClick={selectAll}
                    className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                >
                    すべて選択
                </button>

                <button
                    type="button"
                    onClick={clearAll}
                    className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
                >
                    すべて解除
                </button>

            </div>

            <div className="max-h-60 overflow-y-auto">

                {
                    hospitals.map((hospital) => (

                        <label
                            key={hospital.id}
                            className="flex items-center gap-2 py-1"
                        >

                            <input
                                type="checkbox"
                                checked={selectedHospitalIds.includes(hospital.id)}
                                onChange={() => toggleHospital(hospital.id)}
                            />

                            {hospital.hospitalName}

                        </label>

                    ))
                }

            </div>

        </div>

    )
}