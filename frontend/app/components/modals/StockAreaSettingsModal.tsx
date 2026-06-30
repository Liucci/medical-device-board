import { useState } from "react"
import {createStockAreaTransaction} from "../../api/transactions/stockAreas/createStockAreaTransaction"
import { deleteStockAreaTransaction } from "../../api/transactions/stockAreas/deleteStockAreaTransaction"
import { updateStockAreaTransaction } from "../../api/transactions/stockAreas/updateStockAreaTransaction"
import { executeWithLoading } from "../common/executeWithLoading"
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
    await executeWithLoading({
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
    await executeWithLoading({
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
    await executeWithLoading({
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
    <div className="space-y-4">

      {/* 一覧 */}
      <div className="border rounded p-2 max-h-60 overflow-y-auto">
        {stockAreas.map(area => (
        <div key={area.id} className="flex items-center gap-2 py-1">
            <input
            type="checkbox"
            checked={checkedIds.includes(area.id)}
            onChange={() => toggleCheck(area.id)}
            />

            <span className="flex-1">{area.name}</span>

            {/* 🔥 編集ボタン */}
            <button
            onClick={() => handleRename(area.id, area.name)}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
            編集
            </button>
        </div>
        ))}      </div>

      {/* 追加 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="新規ストックエリア名"
          className="border px-2 py-1 flex-1 rounded"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          追加
        </button>
      </div>

      {/* 削除 */}
      <button
        onClick={handleDelete}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        選択削除
      </button>

    </div>

        <LoadingOverlay loading={loading} />
  </>
  )
}
