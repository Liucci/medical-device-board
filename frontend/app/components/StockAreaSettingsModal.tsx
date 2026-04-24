import { useState } from "react"

type Props = {
  stockAreas: { id: number; name: string }[]
  addStockArea: (name: string) => Promise<void>
  renameStockArea: (id: number, newName: string) => Promise<void>
  deleteStockAreas: (ids: number[]) => Promise<void>

}

export default function StockAreaSettingsModal({ 
    stockAreas,
    addStockArea,
    renameStockArea,
    deleteStockAreas
}: Props) 
 {
  const [checkedIds, setCheckedIds] = useState<number[]>([])
  const [newName, setNewName] = useState("")

  // チェック切り替え
  const toggleCheck = (id: number) => {
    setCheckedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  // 削除（仮：console）
  const handleDelete = () => {
    console.log("削除対象:", checkedIds)
    deleteStockAreas(checkedIds)
  }
  // 名前変更（仮：prompt）
  const handleRename = (id: number, currentName: string) => {
    const newName = prompt("新しい名前を入力", currentName)
    // キャンセルや空文字は無視
    if (!newName) return
    const trimmed = newName.trim()
    // 変更なしも無視
    if (!trimmed) return
    // 既に同名がある場合も無視（必要ならここでAPI呼び出し前に重複チェックも）
    if (trimmed === currentName) return

    renameStockArea(id, trimmed)
}

  // 追加（仮：console）
  const handleAdd = () => {
    if (!newName.trim()) return
    console.log("追加:", newName)
    addStockArea(newName)
    setNewName("")
  }

  return (
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
  )
}
