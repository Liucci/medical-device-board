"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HospitalManagementType } from "../../types/hospitalTypes"
import {fetchHospitalManagementTransaction} from "@/app/api/transactions/hospitals/fetchHospitalManagementTransaction"


import CreateHospitalModal from "./components/CreateHospitalModal"
import EditHospitalModal from "./components/EditHospitalModal"

export default function HospitalManagementPage() {

const [hospitals, setHospitals] = useState<HospitalManagementType[]>([])
const [filteredHospitals, setFilteredHospitals] = useState<HospitalManagementType[]>([])
const [hospitalName, setHospitalName] = useState("")
const [pricePlans, setPricePlans] = useState<string[]>([
  "free",
  "standard",
  "enterprise"
])
const router = useRouter()
const [isActiveList, setIsActiveList] = useState<boolean[]>([
  true,
  false
])
const [createdFrom, setCreatedFrom] = useState("")
const [createdTo, setCreatedTo] = useState("")
const [createOpen, setCreateOpen] = useState(false)
const [editOpen, setEditOpen] = useState(false)

const [
  selectedHospital,
  setSelectedHospital
] = useState<HospitalManagementType | null>(null)


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
                    if (isActiveList.length > 0)
                    {result =
                      result.filter(
                                      hospital =>
                                        isActiveList.includes(
                                                               hospital.isActive
                                                             )
                                    )
                    }
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

            <div className="mb-6 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <button
                  onClick={() => router.push("/system-admin")}
                  className="
                    rounded
                    bg-gray-500
                    px-3
                    py-2
                    text-white
                    hover:bg-gray-600
                  "
                >
                  ← 戻る
                </button>

                <h1 className="text-2xl font-bold">
                  病院管理
                </h1>

              </div>



            </div>

              <button
                onClick={() => setCreateOpen(true)}
                className="
                  rounded
                  bg-blue-500
                  px-4
                  py-2
                  text-white
                  hover:bg-blue-600
                "
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
                      value={hospitalName}
                      onChange={e => setHospitalName(e.target.value)}
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
                      <input
                        type="checkbox"
                        checked={isActiveList.includes(true)}
                        onChange={e =>
                          setIsActiveList(
                            e.target.checked
                              ? [...isActiveList.filter(v => v !== true), true]
                              : isActiveList.filter(v => v !== true)
                          )
                        }
                      />
                      利用中
                    </label>
                    
                    <label>
                      <input
                          type="checkbox"
                          checked={isActiveList.includes(false)}
                          onChange={e =>
                            setIsActiveList(
                              e.target.checked
                                ? [...isActiveList.filter(v => v !== false), false]
                                : isActiveList.filter(v => v !== false)
                            )
                          }
                      />
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
                      value={createdFrom}
                      onChange={e => setCreatedFrom(e.target.value)}
                      className="min-w-0 flex-1 rounded border px-2 py-1"
                    />

                    <span>～</span>

                    <input
                      type="date"
                      value={createdTo}
                      onChange={e => setCreatedTo(e.target.value)}
                      className="min-w-0 flex-1 rounded border px-2 py-1"
                    />

                  </div>
                </div>

              </div>

            </div>

            <div className="mb-3 font-bold">

              検索結果：{filteredHospitals.length}件
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
                                            onClick={() => {
                                                              setSelectedHospital(hospital)
                                                              setEditOpen(true)
                                                            }}
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
                                              {
                                                new Date(hospital.createdAt?? "").toLocaleString("ja-JP", {
                                                  year: "numeric",
                                                  month: "2-digit",
                                                  day: "2-digit",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                })
                                              }
                                            </td>

                                            <td className="border px-3 py-2">
                                              {
                                                new Date(hospital.updatedAt?? "").toLocaleString("ja-JP", {
                                                  year: "numeric",
                                                  month: "2-digit",
                                                  day: "2-digit",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                })
                                              }
                                            </td>
                                      </tr>

                                    )
                                 )
                  }

                </tbody>

              </table>

            </div>
            
            <CreateHospitalModal
              isOpen={createOpen}
              onClose={() => setCreateOpen(false)}
              setHospitals={setHospitals}
            />

            <EditHospitalModal
              isOpen={editOpen}
              hospital={selectedHospital}
              onClose={() => setEditOpen(false)}
              setHospitals={setHospitals}
            />

          </div>




        )
}