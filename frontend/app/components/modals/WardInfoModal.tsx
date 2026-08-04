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
        maxWidth="max-w-[500px]"
      >

        <div className="mt-4 border-t pt-3 space-y-2">


          {/* 状態 */}
          <div className="flex items-center justify-between py-2">

            <div>
              <span className="text-sm text-gray-500">
                状態：
              </span>

              <span className="ml-2 font-medium">
                {status || "情報なし"}
              </span>
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded border px-2 py-1"
            >
              <option value="">なし</option>
              <option value="閉鎖中">閉鎖中</option>
              <option value="制限中">制限中</option>
              <option value="消毒中">消毒中</option>
              <option value="工事中">工事中</option>
            </select>

          </div>
          {/* 備考 */}
          <InfoRow
            label="備考"
            value={note || "情報なし"}
            onEdit={() => {
              const value = prompt(
                "備考を入力してください",
                note
              )

              if (value !== null) {
                setNote(value)
              }
            }}
          />

          {/* 感染症 */}
          <div className="flex items-start justify-between py-2">

            <div className="flex">

              <span className="text-sm text-gray-500 whitespace-nowrap">
                感染症：
              </span>

              <div className="ml-2 flex flex-col gap-1">

                {selectedInfectionIds.length === 0 ? (

                  <span className="text-sm text-gray-400">
                    （なし）
                  </span>

                ) : (

                  selectedInfectionIds.map(id => {

                    const infection =
                      infectionTypes.find(
                        i => i.id === id
                      )

                    return (
                      <div
                        key={id}
                        className="flex items-center gap-1 text-sm"
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

                  })

                )}

              </div>

            </div>

            <button
              onClick={() => setIsInfectionModalOpen(true)}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              ✏
            </button>

          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">

          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2"
          >
            キャンセル
          </button>

          <button
            onClick={handleClear}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            クリア
          </button>

          <button
            onClick={handleSave}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            保存
          </button>

        </div>

        <WardInfectionSelectModal
          isOpen={isInfectionModalOpen}
          onClose={() =>
            setIsInfectionModalOpen(false)
          }
          infectionTypes={infectionTypes}
          selectedInfectionIds={selectedInfectionIds}
          setSelectedInfectionIds={setSelectedInfectionIds}
        />

      </CommonModal>

    <LoadingOverlay loading={loading} /> 
      
    </>
  )
}