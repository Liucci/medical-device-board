"use client"

import { useEffect, useState } from "react"

import { getInspectionTypesFromApi } from "../api/inspection/inspectionTypes/fetchInspectionTypes"

import { getInspectionItemTypesFromApi } from "../api/inspection/inspectionItemTypes/fetchInspectionItemTypes"

import type {
    InspectionType,
} from "../types/inspectionTypes/inspectionTypeTypes"

import type {
    InspectionItemType,
} from "../types/inspectionTypes/inspectionItemTypeTypes"


export default function InspectionEditorPage()
{
    const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([])

    const [inspectionItemTypes, setInspectionItemTypes] = useState<
        InspectionItemType[]
    >([])

    const [inspectionName, setInspectionName] = useState("")

    const [inspectionTypeId, setInspectionTypeId] = useState<number | null>(null)


    useEffect(() =>
    {
        const fetchInitialData = async () =>
        {
            const [
                inspectionTypesData,
                inspectionItemTypesData,
            ] = await Promise.all([
                getInspectionTypesFromApi(),
                getInspectionItemTypesFromApi(),
            ])

            setInspectionTypes(inspectionTypesData)
            setInspectionItemTypes(inspectionItemTypesData)
        }

        fetchInitialData()
    }, [])


    return (
        <div>
            <h1>点検表エディタ</h1>

            <section>
                <h2>点検表情報</h2>

                <div>
                    <label>
                        点検表名
                    </label>

                    <input
                        type="text"
                        value={inspectionName}
                        onChange={(event) =>
                            setInspectionName(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label>
                        点検表種類
                    </label>

                    <select
                        value={inspectionTypeId ?? ""}
                        onChange={(event) =>
                            setInspectionTypeId(
                                event.target.value === ""
                                    ? null
                                    : Number(event.target.value)
                            )
                        }
                    >
                        <option value="">
                            選択してください
                        </option>

                        {inspectionTypes.map((inspectionType) => (
                            <option
                                key={inspectionType.id}
                                value={inspectionType.id}
                            >
                                {inspectionType.name}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            <section>
                <h2>点検項目</h2>
            </section>

            <button
                type="button"
            >
                保存
            </button>
        </div>
    )
}