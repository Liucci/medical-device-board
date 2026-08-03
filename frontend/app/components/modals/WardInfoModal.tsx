"use client"

import { useState,useEffect } from "react"

import { WardType,UpdateWardInfoType  } from "../../types/wardTypes"
import { InfectionTypeType } from "../../types/infectionTypeTypes"
import { WardInfectionType } from "../../types/wardInfectionTypes"

import WardInfectionSelectModal from "./WardInfectionSelectModal"
import CommonModal from "../common/CommonModal"

import { LoadingOverlay } from "../common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../common/executeWithErrorAndLoading"

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
                    actionLabel,
                    onEdit,
                }: 
                    {
                        label: string
                        value: string
                        actionLabel?: string
                        onEdit: () => void
                    }) => 
(
    <div className="flex items-center justify-between py-2">
      <div>
        <span className="text-sm text-gray-500">
          {label}：
        </span>

        <span className="ml-2 font-medium">
          {value || "情報なし"}
        </span>
      </div>

      <button
        onClick={onEdit}
        className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
      >
        備考欄入力
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


          <div className="mt-6">

            <div className="mb-2 flex items-center justify-between">

              <span className="font-semibold">
                感染症
              </span>

              <button
                onClick={() =>
                  setIsInfectionModalOpen(true)
                }
                className="rounded bg-blue-500 px-3 py-1 text-white"
              >
                感染情報追加
              </button>

            </div>

            <div className="space-y-1">

              {selectedInfectionIds.length === 0 ? (
                <div className="text-gray-500">
                  設定なし
                </div>
              ) : (
                selectedInfectionIds.map(id => {
                  const infection = infectionTypes.find(
                    i => i.id === id
                  )

                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: infection?.color,
                        }}
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

            <InfoRow
              label="備考"
              value={note}
              onEdit={() => {
                const value = prompt("備考を入力してください", note)
                if (value !== null) {
                  setNote(value)
                }
              }}
            />


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