"use client"

import { useState,useEffect } from "react"

import { WardType,UpdateWardInfoType  } from "../../types/wardTypes"
import { InfectionTypeType } from "../../types/infectionTypeTypes"
import { WardInfectionType } from "../../types/wardInfectionTypes"

import WardInfectionSelectModal from "./WardInfectionSelectModal"
import CommonModal from "../common/CommonModal"

import { LoadingOverlay } from "../common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../common/executeWithErrorAndLoading"
import { FaVirus } from "react-icons/fa"
type Props = {
                isOpen: boolean
                ward: WardType | null
                onClose: () => void
            
                setWards: React.Dispatch<React.SetStateAction<WardType[]>>
                infectionTypes: InfectionTypeType[]
                wardInfections: WardInfectionType[]
                setWardInfections: React.Dispatch<React.SetStateAction<WardInfectionType[]>>               
                onSubmit: (
                            ward: UpdateWardInfoType,
                            infectionTypeIds: number[]
                          ) => Promise<void>
}

export default function WardInfoModal({
                                        isOpen,
                                        ward,
                                        setWards,
                                        onClose,
                                        infectionTypes,
                                        wardInfections,
                                        setWardInfections,
                                        onSubmit
                                        }: Props)
{
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [note, setNote] = useState("")
  const [selectedInfectionIds, setSelectedInfectionIds] =useState<number[]>([])

  const [isInfectionModalOpen, setIsInfectionModalOpen] =useState(false)

  

  const InfoRow = ({
                    label,
                    value,
                    onEdit,
                  }: {
                      label: string
                      value: React.ReactNode
                      onEdit: () => void
                    }) =>
  (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <span className="text-sm text-gray-500">
          {label}：
        </span>

        <span className="ml-2 font-medium">
          {value}
        </span>
      </div>

      <button
        onClick={onEdit}
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        ✏
      </button>
    </div>
  )


async function handleSave() {
  if (!ward) return
  await executeWithErrorAndLoading({
    setLoading,
    action: async () => {
      await onSubmit(
        {
          id: ward.id,
          status,
          note,
        },
        selectedInfectionIds
      )
      onClose()
    },
  })
}

function handleClear() {
if (!confirm("病棟情報をクリアしますか？ \n\n「保存」を押すと最終確定します。")) {
    return
  }

  setSelectedInfectionIds([])
  setStatus("")
  setNote("")
}



  useEffect(() => {
    if (!ward) return

    setStatus(ward.status ?? "")
    setNote(ward.note ?? "")

    setSelectedInfectionIds(
      wardInfections
        .filter(w => w.wardId === ward.id)
        .map(w => w.infectionTypeId)
    )
  }, [ward, wardInfections])


  if (!isOpen || !ward) return null

return (
    <>
      <CommonModal
        open={isOpen}
        onClose={onClose}
        title={ward.name}
        maxWidth="max-w-[600px]"
      >
        <div className="w-full rounded-xl bg-gray-200 p-5">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="space-y-5">

              {/* ===================================================== */}
              {/* 病棟情報 */}
              {/* ===================================================== */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  病棟情報
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  病棟の状態や備考、感染症情報を設定してください。
                </p>
              </div>

              {/* ===================================================== */}
              {/* 状態 */}
              {/* ===================================================== */}
              <div>
                <label className="text-xs font-medium text-gray-600">
                  状態
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">なし</option>
                  <option value="閉鎖中">閉鎖中</option>
                  <option value="制限中">制限中</option>
                  <option value="消毒中">消毒中</option>
                  <option value="工事中">工事中</option>
                </select>
              </div>

              {/* ===================================================== */}
              {/* 備考 */}
              {/* ===================================================== */}
              <div>
                <label className="text-xs font-medium text-gray-600">
                  備考
                </label>

                <div className="mt-1 flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2">
                  <span className="min-w-0 flex-1 break-words text-sm text-gray-700">
                    {note || "情報なし"}
                  </span>

                  <button
                    onClick={() => {
                      const value = prompt(
                        "備考を入力してください",
                        note
                      )

                      if (value !== null) {
                        setNote(value)
                      }
                    }}
                    className="shrink-0 rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-600 transition hover:bg-gray-200"
                  >
                    ✏
                  </button>
                </div>
              </div>

              {/* ===================================================== */}
              {/* 感染症 */}
              {/* ===================================================== */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-600">
                    感染症
                  </label>

                  <button
                    onClick={() => setIsInfectionModalOpen(true)}
                    className="rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-600 transition hover:bg-gray-200"
                  >
                    ✏
                  </button>
                </div>

                <div className="mt-1 min-h-[42px] rounded-lg border border-gray-300 bg-white px-3 py-2">
                  {selectedInfectionIds.length === 0 ? (
                    <span className="text-sm text-gray-400">
                      （なし）
                    </span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {selectedInfectionIds.map(id => {
                        const infection =
                          infectionTypes.find(i => i.id === id)

                        return (
                          <div
                            key={id}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <FaVirus
                              size={12}
                              color={infection?.color}
                            />
                            <span>
                              {infection?.name}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ===================================================== */}
              {/* ボタン */}
              {/* ===================================================== */}
              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button
                  onClick={onClose}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
                >
                  キャンセル
                </button>

                <button
                  onClick={handleClear}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  クリア
                </button>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {loading ? "保存中..." : "保存"}
                </button>
              </div>

            </div>
          </div>
        </div>

        <WardInfectionSelectModal
          isOpen={isInfectionModalOpen}
          onClose={() => setIsInfectionModalOpen(false)}
          infectionTypes={infectionTypes}
          selectedInfectionIds={selectedInfectionIds}
          setSelectedInfectionIds={setSelectedInfectionIds}
        />
      </CommonModal>

      <LoadingOverlay loading={loading} />
    </>
  )  
}