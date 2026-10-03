import { useState } from "react"
import { InfectionTypeType } from "../../types/infectionTypeTypes"
import { createInfectionTypeTransaction } from "../../api/transactions/infectionTypes/createInfectionTypeTransaction"
import { updateInfectionTypeTransaction } from "../../api/transactions/infectionTypes/updateInfectionTypeTransaction"
import { deleteInfectionTypesTransaction } from "../../api/transactions/infectionTypes/deleteInfectionTypesTransaction"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../common/LoadingOverlay"
import useInputModal from "../../components/common/useInputModal"
import { Edit2, Plus, Trash2 } from "lucide-react"

type Props = {
  infectionTypes: InfectionTypeType[]
  setInfectionTypes: React.Dispatch<React.SetStateAction<any[]>>
}

export default function InfectionSettingsModal({ infectionTypes, setInfectionTypes }: Props) {
  console.log("InfectionSettingsModal")
  const [checkedIds, setCheckedIds] = useState<number[]>([])
  const [newName, setNewName] = useState("")
  const [newColor, setNewColor] = useState("#ff0000")
  const [loading, setLoading] = useState(false)
  const inputModal = useInputModal()

  const toggleCheck = (id: number) => {
    setCheckedIds(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id])
  }

  const handleAdd = async () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        await createInfectionTypeTransaction({
          infectionType: {
            name: trimmed,
            color: newColor
          },
          setInfectionTypes
        })
      }
    })
    setNewName("")
    setNewColor("#ff0000")
  }

  const handleRename = (infectionType: InfectionTypeType) => {
    inputModal.openInputModal({
      title: "感染症名の変更",
      label: "感染症名",
      value: infectionType.name,
      type: "text",
      buttonPattern: "save_cancel",
      onConfirm: async (name: string) => {
        const trimmed = name.trim()
        if (!trimmed || trimmed === infectionType.name) return
        await executeWithErrorAndLoading({
          setLoading,
          action: async () => {
            await updateInfectionTypeTransaction({
              infectionType: {
                id: infectionType.id,
                name: trimmed,
                color: infectionType.color
              },
              setInfectionTypes
            })
          }
        })
      }
    })
  }

  const handleColorChange = async (infectionType: InfectionTypeType, color: string) => {
    if (color === infectionType.color) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        await updateInfectionTypeTransaction({
          infectionType: {
            id: infectionType.id,
            name: infectionType.name,
            color
          },
          setInfectionTypes
        })
      }
    })
  }

  const handleDelete = async () => {
    if (checkedIds.length === 0) return
    const ok = await inputModal.confirm({
      title: "削除の確認",
      message: "選択した感染症を削除しますか？",
      buttonPattern: "yes_no",
      confirmVariant: "danger",
      icon: "warning"
    })
    if (!ok) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        await deleteInfectionTypesTransaction({
          infectionTypes: { ids: checkedIds },
          setInfectionTypes
        })
      }
    })
    setCheckedIds([])
  }

  return (
    <>
      <div className="w-full rounded-2xl bg-slate-50 p-4 sm:p-5">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
            <h3 className="text-xs font-bold tracking-wide text-slate-700">感染症</h3>
            <p className="mt-1 text-[11px] text-slate-500">感染症の追加、名前や色の変更、削除を行います</p>
          </div>

          <div className="p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold tracking-wide text-slate-700">登録されている感染症</div>
                <div className="mt-1 text-[11px] text-slate-500">{infectionTypes.length} 件</div>
              </div>

              {checkedIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-[11px] font-bold text-rose-600 transition-colors hover:bg-rose-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  選択削除
                </button>
              )}
            </div>

            <div className="max-h-[calc(90vh-280px)] overflow-y-auto rounded-lg border border-slate-200">
              {infectionTypes.length === 0 ? (
                <div className="bg-slate-50 py-12 text-center text-xs text-slate-400">登録されている感染症はありません</div>
              ) : (
                <div>
                  {infectionTypes.map((infectionType) => (
                    <div
                      key={infectionType.id}
                      className="flex items-center gap-3 border-b border-slate-100 px-3 py-2.5 last:border-b-0 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={checkedIds.includes(infectionType.id)}
                        onChange={() => toggleCheck(infectionType.id)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-teal-700 focus:ring-teal-500"
                      />

                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">{infectionType.name}</span>

                      <input
                        type="color"
                        value={infectionType.color}
                        onChange={(e) => handleColorChange(infectionType, e.target.value)}
                        className="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                      />

                      <button
                        type="button"
                        onClick={() => handleRename(infectionType)}
                        aria-label="感染症名を編集"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4">
                <h4 className="text-xs font-bold tracking-wide text-slate-700">新しい感染症を追加</h4>
                <p className="mt-1 text-[11px] text-slate-500">感染症名と表示色を設定してください</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <label className="mb-2 block text-xs font-medium text-slate-500">感染症名</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="例：MRSA"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div className="shrink-0">
                  <label className="mb-2 block text-xs font-medium text-slate-500">色</label>
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-teal-700 px-4 text-xs font-bold text-white transition-colors hover:bg-teal-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  追加
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoadingOverlay loading={loading} />
      {inputModal.ModalElement}
    </>
  )
}