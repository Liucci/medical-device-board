import { useState } from "react"
import {createStockAreaTransaction} from "../../api/transactions/stockAreas/createStockAreaTransaction"
import { deleteStockAreaTransaction } from "../../api/transactions/stockAreas/deleteStockAreaTransaction"
import { updateStockAreaTransaction } from "../../api/transactions/stockAreas/updateStockAreaTransaction"
import { executeWithLoading } from "../common/executeWithLoading"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"

import {LoadingOverlay} from "../common/LoadingOverlay"


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
      <div className="w-full rounded-2xl bg-gray-200 p-5">

        <div className="w-full rounded-xl bg-white p-6 shadow-sm">

          {/* ================================================= */}
          {/* タイトル */}
          {/* ================================================= */}
          <div className="mb-6">

            <h3 className="text-lg font-semibold text-gray-800">
              ストックエリア
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              ストックエリアの追加、名前の変更、削除を行います
            </p>

          </div>


          {/* ================================================= */}
          {/* 一覧ヘッダー */}
          {/* ================================================= */}
          <div className="mb-3 flex items-center justify-between">

            <div>

              <div className="text-sm font-semibold text-gray-800">
                登録されているストックエリア
              </div>

              <div className="mt-1 text-xs text-gray-500">
                {stockAreas.length} 件
              </div>

            </div>


            {/* 選択削除 */}
            {checkedIds.length > 0 && (
              <button
                onClick={handleDelete}
                className="
                  rounded-lg
                  bg-red-50
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-red-600
                  transition
                  hover:bg-red-100
                "
              >
                選択削除
              </button>
            )}

          </div>


          {/* ================================================= */}
          {/* 一覧 */}
          {/* ================================================= */}
          <div className="max-h-[calc(90vh-280px)] overflow-y-auto">

            {stockAreas.length === 0 ? (

              <div className="py-12 text-center text-sm text-gray-400">
                登録されているストックエリアはありません
              </div>

            ) : (

              <div>

                {stockAreas.map((area) => (

                  <div
                    key={area.id}
                    className="
                      flex
                      items-center
                      gap-3
                      border-b
                      border-gray-100
                      py-3
                      last:border-b-0
                      hover:bg-gray-50
                    "
                  >

                    {/* チェックボックス */}
                    <input
                      type="checkbox"
                      checked={checkedIds.includes(area.id)}
                      onChange={() => toggleCheck(area.id)}
                      className="
                        h-4
                        w-4
                        cursor-pointer
                        rounded
                        border-gray-300
                        text-blue-500
                        focus:ring-blue-400
                      "
                    />


                    {/* ストックエリア名 */}
                    <span className="min-w-0 flex-1 truncate text-sm text-gray-800">
                      {area.name}
                    </span>


                    {/* 編集 */}
                    <button
                      onClick={() =>
                        handleRename(area.id, area.name)
                      }
                      className="
                        shrink-0
                        rounded-lg
                        bg-gray-100
                        px-3
                        py-1.5
                        text-sm
                        font-medium
                        text-gray-600
                        transition
                        hover:bg-gray-200
                        hover:text-gray-800
                      "
                    >
                      ✏
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* ================================================= */}
          {/* ストックエリア追加 */}
          {/* ================================================= */}
          <div className="mt-8">

            <div className="mb-4">

              <h4 className="text-sm font-semibold text-gray-800">
                新しいストックエリアを追加
              </h4>

              <p className="mt-1 text-xs text-gray-500">
                新しいストックエリア名を入力してください
              </p>

            </div>


            <div className="flex gap-3">

              <input
                type="text"
                value={newName}
                onChange={(e) =>
                  setNewName(e.target.value)
                }
                placeholder="例：中央材料室"
                className="
                  min-w-0
                  flex-1
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

              <button
                onClick={handleAdd}
                className="
                  shrink-0
                  rounded-lg
                  bg-blue-500
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-blue-600
                "
              >
                追加
              </button>

            </div>

          </div>

        </div>
      </div>


      {/* ================================================= */}
      {/* Loading */}
      {/* ================================================= */}
      <LoadingOverlay loading={loading} />

    </>
  )
}
