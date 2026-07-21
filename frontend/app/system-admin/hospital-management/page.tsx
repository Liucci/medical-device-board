"use client"

import { useEffect, useState } from "react"

import { HospitalManagementType } from "../../types/hospitalTypes"

import {
         fetchHospitalManagementTransaction
       } from "@/app/api/transactions/hospitals/fetchHospitalManagementTransaction"

export default function HospitalManagementPage() {

const [hospitals, setHospitals] = useState<HospitalManagementType[]>([])
const [filteredHospitals, setFilteredHospitals] = useState<HospitalManagementType[]>([])

const [hospitalName, setHospitalName] = useState("")

const [pricePlans, setPricePlans] = useState<string[]>([
  "free",
  "standard",
  "enterprise"
])

const [isActiveList, setIsActiveList] = useState<boolean[]>([
  true,
  false
])

const [createdFrom, setCreatedFrom] = useState("")
const [createdTo, setCreatedTo] = useState("")

useEffect(
            () => {
                    fetchHospitalManagementTransaction({
                                                          setHospitals,
                                                          //setFilteredHospitals
                                                        })
                  },
            []
         )

useEffect(
            () => {

                    let result = [...hospitals]

                    // 病院名
                    if (hospitalName !== "")
                    {
                      result =
                        result.filter(
                                        hospital =>
                                          hospital
                                            .hospitalName
                                            .toLowerCase()
                                            .includes(
                                                        hospitalName.toLowerCase()
                                                      )
                                      )
                    }

                    // プラン
                    if (pricePlans.length > 0)
                    {
                      result =
                        result.filter(
                                        hospital =>
                                          pricePlans.includes(
                                                                hospital.pricePlan ?? ""
                                                              )
                                      )
                    }

                    // 利用状態
                    result =
                      result.filter(
                                      hospital =>
                                        isActiveList.includes(
                                                               hospital.isActive
                                                             )
                                    )

                    // 登録日 From
                    if (createdFrom !== "")
                    {
                      result =
                        result.filter(
                                        hospital =>
                                          hospital.createdAt.substring(
                                                                       0,
                                                                       10
                                                                     ) >= createdFrom
                                      )
                    }

                    // 登録日 To
                    if (createdTo !== "")
                    {
                      result =
                        result.filter(
                                        hospital =>
                                          hospital.createdAt.substring(
                                                                       0,
                                                                       10
                                                                     ) <= createdTo
                                      )
                    }

                    setFilteredHospitals(result)

                  },
            [
              hospitals,
              hospitalName,
              pricePlans,
              isActiveList,
              createdFrom,
              createdTo
            ]
         )

  return (
          <div className="flex h-full flex-col p-6">

            <div className="mb-6 flex items-center justify-between">

              <h1 className="text-2xl font-bold">
                病院管理
              </h1>

              <button
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                新規病院登録
              </button>

            </div>

            <div className="mb-6 rounded border p-4">

              <div className="mb-4 text-lg font-bold">
                検索条件
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <div className="mb-1">
                    病院名
                  </div>

                  <input
                    className="w-full rounded border px-2 py-1"
                  />

                </div>

                <div>

                  <div className="mb-1">
                    プラン
                  </div>

                  <div className="flex gap-4">

                    <label>
                    <input
                        type="checkbox"
                        checked={pricePlans.includes("free")}
                        onChange={e =>
                        setPricePlans(
                            e.target.checked
                            ? [...pricePlans, "free"]
                            : pricePlans.filter(plan => plan !== "free")
                        )
                        }
                    />
                    Free
                    </label>

                    <label>
                    <input
                        type="checkbox"
                        checked={pricePlans.includes("standard")}
                        onChange={e =>
                        setPricePlans(
                            e.target.checked
                            ? [...pricePlans, "standard"]
                            : pricePlans.filter(plan => plan !== "standard")
                        )
                        }
                    />
                    Standard
                    </label>

                    <label>
                    <input
                        type="checkbox"
                        checked={pricePlans.includes("enterprise")}
                        onChange={e =>
                        setPricePlans(
                            e.target.checked
                            ? [...pricePlans, "enterprise"]
                            : pricePlans.filter(plan => plan !== "enterprise")
                        )
                        }
                    />
                    Enterprise
                    </label>
                  </div>

                </div>

                <div>

                  <div className="mb-1">
                    状態
                  </div>

                  <div className="flex gap-4">

                    <label>
                      <input type="checkbox" />
                      利用中
                    </label>

                    <label>
                      <input type="checkbox" />
                      停止
                    </label>

                  </div>

                </div>

                <div>

                  <div className="mb-1">
                    登録期間
                  </div>

                  <div className="flex items-center gap-2">

                    <input
                      type="date"
                      className="rounded border px-2 py-1"
                    />

                    ～

                    <input
                      type="date"
                      className="rounded border px-2 py-1"
                    />

                  </div>

                </div>

              </div>

            </div>

            <div className="mb-3 font-bold">

              検索結果：{hospitals.length}件

            </div>

            <div className="flex-1 overflow-auto rounded border">

              <table className="min-w-[1400px] border-collapse">

                <thead className="sticky top-0 bg-gray-100">

                  <tr>

                    <th className="border px-3 py-2">
                      Edit
                    </th>

                    <th className="border px-3 py-2">
                      病院名
                    </th>

                    <th className="border px-3 py-2">
                      プラン
                    </th>

                    <th className="border px-3 py-2">
                      状態
                    </th>

                    <th className="border px-3 py-2">
                      ユーザー数
                    </th>

                    <th className="border px-3 py-2">
                      機器数
                    </th>

                    <th className="border px-3 py-2">
                      登録日
                    </th>

                    <th className="border px-3 py-2">
                      更新日
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {
                   filteredHospitals.map(
                                    hospital => (

                                      <tr
                                        key={hospital.id}
                                      >

                                        <td className="border px-3 py-2">

                                          <button
                                            className="rounded bg-gray-600 px-3 py-1 text-white hover:bg-gray-700"
                                          >
                                            Open
                                          </button>

                                        </td>

                                        <td className="border px-3 py-2">
                                          {hospital.hospitalName}
                                        </td>

                                        <td className="border px-3 py-2">
                                          {hospital.pricePlan}
                                        </td>

                                        <td className="border px-3 py-2">
                                          {hospital.isActive ? "利用中" : "停止"}
                                        </td>

                                        <td className="border px-3 py-2 text-center">
                                          {hospital.userCount}
                                        </td>

                                        <td className="border px-3 py-2 text-center">
                                          {hospital.deviceCount}
                                        </td>

                                        <td className="border px-3 py-2">
                                          {hospital.createdAt}
                                        </td>

                                        <td className="border px-3 py-2">
                                          {hospital.updatedAt}
                                        </td>

                                      </tr>

                                    )
                                 )
                  }

                </tbody>

              </table>

            </div>

          </div>
        )
}