import { useState } from "react"
import {createDeviceTypeTransaction} from  "../../../app/api/transactions/deviceTypes/createDeviceTypeTransaction"

type Props = {
  deviceTypes: { id: number; name: string }[]
  setDeviceTypes:React.Dispatch<React.SetStateAction<any[]>>
  deviceModels: { id: number; deviceTypeId: number; name: string }[]
  setDeviceModels:React.Dispatch<React.SetStateAction<any[]>>
  renameDeviceType: (id: number, newName: string) => Promise<boolean>
  deleteDeviceTypes: (ids: number[]) => Promise<boolean>

  addDeviceModel: (deviceTypeId: number, name: string) => Promise<void>
  renameDeviceModel: (id: number, newName: string) => Promise<boolean>
  deleteDeviceModels: (ids: number[]) => Promise<boolean>
}

export default function DeviceTypeSettingsModal({
  deviceTypes,
  setDeviceTypes,
  deviceModels,
  setDeviceModels,
  renameDeviceType,
  deleteDeviceTypes,
  addDeviceModel,
  renameDeviceModel,
  deleteDeviceModels
}: Props) {

  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null)
  const [newTypeName, setNewTypeName] = useState("")
  const [newModelName, setNewModelName] = useState("")
  const [checkedModelIds, setCheckedModelIds] = useState<number[]>([])

  // ===== deviceType =====
  const handleAddType = async() => {
      const trimmed = newTypeName.trim()
      if (!trimmed) {return}

      const exists = deviceTypes.some(
                                        t =>
                                        t.name.toLowerCase() ===
                                        trimmed.toLowerCase()
                                    )

      if (exists) {
          alert("同じ機種が既に存在します")
          return
      }

      await createDeviceTypeTransaction(
                                          trimmed,
                                          setNewTypeName,
                                          setDeviceTypes
                                        )
  }

  const handleRenameType = async() => {
    if (!selectedTypeId) return

    const type = deviceTypes.find(t => t.id === selectedTypeId)
    if (!type) return

    const name = prompt("新しい機種名", type.name)
    if (!name) return

    await renameDeviceType(selectedTypeId, name)
  }

  const handleDeleteType =async () => {
    if (!selectedTypeId) {
      return
    }
    if (
      !confirm(
        "機種を削除しますか？（型式がある場合は削除できません）"
      )
    ) return
    const success =
      await deleteDeviceTypes([
        selectedTypeId
      ])
    if (!success) return
    setSelectedTypeId(null)
  }
  // ===== deviceModel =====
  const filteredModels = deviceModels
    .filter(m => m.deviceTypeId === selectedTypeId)
    .sort((a, b) => a.name.localeCompare(b.name, "ja"))
  const toggleModel = (id: number) => {
    setCheckedModelIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleAddModel = async() => {
    if (!selectedTypeId) {
      alert("機種を選択してください")
      return
    }

    if (!newModelName.trim()) return

    await addDeviceModel(selectedTypeId, newModelName)
    setNewModelName("")
  }

  const handleDeleteModels =async () => {
    const success =
      await deleteDeviceModels(
        checkedModelIds
      )
    if (!success) return
    setCheckedModelIds([])
  }
  
  const handleRenameModel = async(model: { id: number; name: string }) => {
    const name = prompt("新しい型式名", model.name)
    if (!name) return

   await renameDeviceModel(model.id, name)
  }

  return (
    <div className="space-y-6">

      {/* ===== deviceType操作 ===== */}
      <div className="space-y-2">

        <div className="flex gap-2">
          <select
            value={selectedTypeId ?? ""}
            onChange={(e) => {
              const val = Number(e.target.value)
              setSelectedTypeId(val || null)
              setCheckedModelIds([])
            }}
            className="border px-2 py-1 rounded"
          >
            <option value="">機種選択</option>
            {deviceTypes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <button onClick={handleRenameType} className="px-2 bg-gray-200 rounded">✏</button>
          <button onClick={handleDeleteType} className="px-2 bg-red-500 text-white rounded">削除</button>
        </div>

        {/* 未選択時のみ表示 */}
        {!selectedTypeId && (
          <div className="flex gap-2">
            <input
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="新規機種名"
              className="border px-2 py-1 flex-1 rounded"
            />
            <button onClick={handleAddType} className="px-3 bg-blue-500 text-white rounded">
              追加
            </button>
          </div>
        )}
      </div>

      {/* ===== deviceModel操作 ===== */}
      <div className="space-y-2">

        <div className="border rounded p-2 max-h-60 overflow-y-auto">
          {filteredModels.map(model => (
            <div key={model.id} className="flex items-center gap-2 py-1">

              <input
                type="checkbox"
                checked={checkedModelIds.includes(model.id)}
                onChange={() => toggleModel(model.id)}
              />

              <span className="flex-1">{model.name}</span>

              <button
                onClick={() => handleRenameModel(model)}
                className="px-2 bg-gray-200 rounded"
              >
                ✏
              </button>

            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={newModelName}
            onChange={(e) => setNewModelName(e.target.value)}
            placeholder="新規型式名"
            className="border px-2 py-1 flex-1 rounded"
          />
          <button
            onClick={handleAddModel}
            className="px-3 bg-blue-500 text-white rounded"
          >
            追加
          </button>
        </div>

        <button
          onClick={handleDeleteModels}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          選択削除
        </button>

      </div>

    </div>
  )
}