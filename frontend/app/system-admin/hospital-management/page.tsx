"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HospitalManagementType } from "../../types/hospitalTypes"
import {fetchHospitalManagementTransaction} from "@/app/api/transactions/hospitals/fetchHospitalManagementTransaction"
import {LoadingOverlay} from "../../components/common/LoadingOverlay"


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
const [loading, setLoading] = useState(false)
const [
  selectedHospital,
  setSelectedHospital
] = useState<HospitalManagementType | null>(null)


useEffect(() => {fetchHospitalManagementTransaction({
                                                        setHospitals,
                                                        setLoading
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
    <>
      <div className="flex h-full min-h-0 flex-col gap-5 overflow-hidden bg-[#0a122a] p-4 text-[#dbe1ff] sm:p-6">

        {/* ヘッダー */}
        <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/system-admin")}
              className="
                rounded-lg border border-white/10 bg-white/5 px-3 py-2
                text-xs font-bold text-[#c5d0eb] transition-colors
                hover:border-white/20 hover:bg-white/10
              "
            >
              ← 戻る
            </button>

            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#75dfff]">
                DEVIX / SYSTEM ADMIN
              </div>
              <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                病院管理
              </h1>
            </div>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="
              rounded-lg bg-gradient-to-r from-[#438fff] to-[#00d2ff]
              px-5 py-2.5 text-xs font-bold text-white shadow-lg
              shadow-cyan-950/30 transition-all
              hover:brightness-110 active:scale-[0.98]
            "
          >
            新規病院登録
          </button>
        </div>

        {/* 検索条件 */}
        <section
          className="
            shrink-0 rounded-2xl border border-white/10
            bg-[#111d3b]/80 p-4 shadow-xl shadow-black/10
            backdrop-blur-xl sm:p-5
          "
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              検索条件
            </h2>
            <span className="text-[10px] font-medium tracking-wide text-[#8292b7]">
              SEARCH FILTER
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* 病院名 */}
            <div>
              <label className="mb-2 block text-xs font-medium text-[#9ba9c9]">
                病院名
              </label>
              <input
                value={hospitalName}
                onChange={e => setHospitalName(e.target.value)}
                placeholder="病院名で検索"
                className="
                  w-full rounded-lg border border-white/10
                  bg-[#0a122a]/80 px-3 py-2.5 text-sm text-white
                  outline-none transition-colors placeholder:text-[#596987]
                  focus:border-[#75dfff]/60 focus:ring-2 focus:ring-[#75dfff]/10
                "
              />
            </div>

            {/* プラン */}
            <div>
              <label className="mb-2 block text-xs font-medium text-[#9ba9c9]">
                プラン
              </label>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-[#dbe1ff]">
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
                    className="h-4 w-4 cursor-pointer accent-[#38bdf8]"
                  />
                  Free
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-xs text-[#dbe1ff]">
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
                    className="h-4 w-4 cursor-pointer accent-[#38bdf8]"
                  />
                  Standard
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-xs text-[#dbe1ff]">
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
                    className="h-4 w-4 cursor-pointer accent-[#38bdf8]"
                  />
                  Enterprise
                </label>
              </div>
            </div>

            {/* 状態 */}
            <div>
              <label className="mb-2 block text-xs font-medium text-[#9ba9c9]">
                利用状態
              </label>
              <div className="flex items-center gap-5 pt-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-[#dbe1ff]">
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
                    className="h-4 w-4 cursor-pointer accent-[#38bdf8]"
                  />
                  利用中
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-xs text-[#dbe1ff]">
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
                    className="h-4 w-4 cursor-pointer accent-[#38bdf8]"
                  />
                  停止
                </label>
              </div>
            </div>

            {/* 登録期間 */}
            <div>
              <label className="mb-2 block text-xs font-medium text-[#9ba9c9]">
                登録期間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={createdFrom}
                  onChange={e => setCreatedFrom(e.target.value)}
                  className="
                    min-w-0 flex-1 rounded-lg border border-white/10
                    bg-[#0a122a]/80 px-2 py-2.5 text-base text-white
                    outline-none [color-scheme:dark]
                    focus:border-[#75dfff]/60 focus:ring-2 focus:ring-[#75dfff]/10
                  "
                />

                <span className="text-xs text-[#8292b7]">～</span>

                <input
                  type="date"
                  value={createdTo}
                  onChange={e => setCreatedTo(e.target.value)}
                  className="
                    min-w-0 flex-1 rounded-lg border border-white/10
                    bg-[#0a122a]/80 px-2 py-2.5 text-base text-white
                    outline-none [color-scheme:dark]
                    focus:border-[#75dfff]/60 focus:ring-2 focus:ring-[#75dfff]/10
                  "
                />
              </div>
            </div>

          </div>
        </section>

        {/* 検索結果 */}
        <div className="flex shrink-0 items-center justify-between">
          <div className="text-sm font-bold text-white">
            病院一覧
          </div>
          <div className="text-xs text-[#9ba9c9]">
            検索結果：
            <span className="font-bold tabular-nums text-[#75dfff]">
              {filteredHospitals.length}
            </span>
            件
          </div>
        </div>

        {/* 病院一覧テーブル */}
        <div
          className="
            min-h-0 flex-1 overflow-auto rounded-2xl
            border border-white/10 bg-[#111d3b]/80
            shadow-xl shadow-black/10 backdrop-blur-xl
          "
        >
          <table className="min-w-[1200px] w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[#172747]">
              <tr className="border-b border-white/10 text-[11px] font-bold tracking-wide text-[#9ba9c9]">
                <th className="w-24 px-4 py-4 text-center">
                  編集
                </th>
                <th className="px-4 py-4">
                  病院名
                </th>
                <th className="w-36 px-4 py-4">
                  プラン
                </th>
                <th className="w-28 px-4 py-4">
                  状態
                </th>
                <th className="w-28 px-4 py-4 text-center">
                  ユーザー数
                </th>
                <th className="w-28 px-4 py-4 text-center">
                  機器数
                </th>
                <th className="w-48 px-4 py-4">
                  登録日
                </th>
                <th className="w-48 px-4 py-4">
                  更新日
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.06]">
              {filteredHospitals.map(hospital => (
                <tr
                  key={hospital.id}
                  className="transition-colors hover:bg-white/[0.04]"
                >
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedHospital(hospital)
                        setEditOpen(true)
                      }}
                      className="
                        rounded-lg border border-[#75dfff]/20
                        bg-[#75dfff]/[0.08] px-3 py-1.5
                        text-[11px] font-bold text-[#75dfff]
                        transition-colors hover:border-[#75dfff]/50
                        hover:bg-[#75dfff]/[0.15]
                      "
                    >
                      編集
                    </button>
                  </td>

                  <td className="px-4 py-3 text-sm font-bold text-[#e5ebff]">
                    {hospital.hospitalName}
                  </td>

                  <td className="px-4 py-3 text-xs text-[#c5d0eb]">
                    {hospital.pricePlan}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`
                        inline-flex items-center rounded-full px-2.5 py-1
                        text-[10px] font-bold
                        ${
                          hospital.isActive
                            ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                            : "border border-rose-400/20 bg-rose-400/10 text-rose-300"
                        }
                      `}
                    >
                      {hospital.isActive ? "利用中" : "停止"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center text-sm tabular-nums text-[#dbe1ff]">
                    {hospital.userCount}
                  </td>

                  <td className="px-4 py-3 text-center text-sm tabular-nums text-[#dbe1ff]">
                    {hospital.deviceCount}
                  </td>

                  <td className="px-4 py-3 text-xs tabular-nums text-[#9ba9c9]">
                    {new Date(hospital.createdAt ?? "").toLocaleString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="px-4 py-3 text-xs tabular-nums text-[#9ba9c9]">
                    {new Date(hospital.updatedAt ?? "").toLocaleString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}

              {filteredHospitals.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-16 text-center text-xs text-[#8292b7]"
                  >
                    該当する病院はありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* モーダル */}
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

      <LoadingOverlay loading={loading} />
    </>
  )
        
}