import { useState } from "react"
import {createStockAreaTransaction} from "../../api/transactions/stockAreas/createStockAreaTransaction"
import { deleteStockAreaTransaction } from "../../api/transactions/stockAreas/deleteStockAreaTransaction"
import { updateStockAreaTransaction } from "../../api/transactions/stockAreas/updateStockAreaTransaction"
import { executeWithLoading } from "../common/executeWithLoading"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"

import {LoadingOverlay} from "../common/LoadingOverlay"
import { Edit2, Plus, Trash2 } from "lucide-react"

type Props = {
  stockAreas: { id: number; name: string }[]
  setStockAreas: React.Dispatch<React.SetStateAction<any[]>>

}

export default function StockAreaSettingsModal({ 
                                                  stockAreas,
                                                  setStockAreas,
                                              }: Props) 
 {
  const [checkedIds, setCheckedIds] = useState<number[]>([])
  const [newName, setNewName] = useState("")
  const [loading, setLoading] = useState(false)

// チェック入れたstockAreaのIdをlist化
  const toggleCheck = (id: number) => {
                            setCheckedIds(prev =>
                                          prev.includes(id)
                                            ? prev.filter(i => i !== id)
                                            : [...prev, id]
                            )
  }

  // 削除
  const handleDelete = async() => {
    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {
        await deleteStockAreaTransaction({
                                            stockAreaIds: checkedIds,
                                            setStockAreas,
                                          })
          }
    })
   setCheckedIds([])
  }
  // 名前変更（仮：prompt）
  const handleRename = async(id: number, currentName: string) => {

      const newName = prompt("新しい名前を入力", currentName)
      if (!newName) {return}
      const trimmed = newName.trim()
      if (!trimmed) {return}
      if (trimmed === currentName) {return}
    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {
            await updateStockAreaTransaction({
                                                stockArea: {
                                                            id,
                                                            name: trimmed
                                                          },
                                                setStockAreas,
                                              })
          }
    })
    setNewName("")
    }

  // 追加
  const handleAdd = async() => {
    if (!newName.trim()) {return}
    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {
              await createStockAreaTransaction({
                                                      stockArea: {
                                                                  name: newName.trim()
                                                                },
                                                      setStockAreas,
                                                    })
        }
    })
      setNewName("")
    }

  return (
    <>
      <div className="flex h-full min-h-0 w-full flex-col bg-slate-50">

        {/* Header */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-4 sm:px-5">
          <div className="text-xs font-bold tracking-wide text-slate-700">
            ストックエリア
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            ストックエリアの追加、名前の変更、削除を行います
          </p>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">

          {/* 一覧 */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <div className="text-xs font-bold tracking-wide text-slate-700">
                  登録されているストックエリア
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  {stockAreas.length} 件
                </div>
              </div>

              {checkedIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="
                    flex
                    h-8
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-rose-200
                    bg-rose-50
                    px-3
                    text-xs
                    font-bold
                    text-rose-700
                    transition-colors
                    hover:bg-rose-100
                  "
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  選択削除
                </button>
              )}
            </div>

            <div className="px-3 py-1">
              {stockAreas.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  登録されているストックエリアはありません
                </div>
              ) : (
                <div>
                  {stockAreas.map((area) => (
                    <div
                      key={area.id}
                      className="
                        flex
                        min-h-12
                        items-center
                        gap-3
                        border-b
                        border-slate-100
                        px-2
                        py-2
                        last:border-b-0
                      "
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={checkedIds.includes(area.id)}
                        onChange={() => toggleCheck(area.id)}
                        className="
                          h-4
                          w-4
                          shrink-0
                          cursor-pointer
                          rounded
                          border-slate-300
                          text-teal-700
                          focus:ring-teal-200
                        "
                      />

                      {/* Name */}
                      <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900">
                        {area.name}
                      </span>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() =>
                          handleRename(area.id, area.name)
                        }
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-400
                          transition-colors
                          hover:bg-slate-100
                          hover:text-slate-700
                        "
                        aria-label={`${area.name}を編集`}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 追加 */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-4 py-3">
              <div className="text-xs font-bold tracking-wide text-slate-700">
                新しいストックエリアを追加
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                新しいストックエリア名を入力してください
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 sm:flex-row">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="例：中央材料室"
                className="
                  min-w-0
                  flex-1
                  rounded-lg
                  border
                  border-slate-200
                  bg-slate-50
                  px-3
                  py-2.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition-colors
                  placeholder:text-slate-400
                  focus:border-teal-600
                  focus:bg-white
                  focus:ring-2
                  focus:ring-teal-100
                "
              />

              <button
                type="button"
                onClick={handleAdd}
                className="
                  flex
                  h-10
                  shrink-0
                  items-center
                  justify-center
                  gap-1.5
                  rounded-lg
                  bg-teal-700
                  px-4
                  text-xs
                  font-bold
                  text-white
                  transition-colors
                  hover:bg-teal-800
                "
              >
                <Plus className="h-3.5 w-3.5" />
                追加
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Loading */}
      <LoadingOverlay loading={loading} />
    </>
  )  
}
