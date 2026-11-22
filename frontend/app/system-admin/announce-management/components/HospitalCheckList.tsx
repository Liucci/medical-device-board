
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
}: HospitalCheckListProps) {
    console.log("HospitalCheckList")

    const toggleHospital = (hospitalId: string) => {
        if (selectedHospitalIds.includes(hospitalId)) {
            setSelectedHospitalIds(selectedHospitalIds.filter(id => id !== hospitalId))
            return
        }
        setSelectedHospitalIds([...selectedHospitalIds, hospitalId])
    }

    const selectAll = () => {
        setSelectedHospitalIds(hospitals.map(hospital => hospital.id))
    }

    const clearAll = () => {
        setSelectedHospitalIds([])
    }

    return (
        <div className="rounded-lg border border-gray-300 bg-white p-3">
            <div className="mb-3 flex gap-2">
                <button
                    type="button"
                    onClick={selectAll}
                    className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white transition hover:bg-blue-600"
                >
                    すべて選択
                </button>
                <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-lg bg-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-400"
                >
                    すべて解除
                </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
                {hospitals.map((hospital) => (
                    <label key={hospital.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={selectedHospitalIds.includes(hospital.id)}
                            onChange={() => toggleHospital(hospital.id)}
                            className="accent-blue-500"
                        />
                        {hospital.hospitalName}
                    </label>
                ))}
            </div>
        </div>
    )
}
