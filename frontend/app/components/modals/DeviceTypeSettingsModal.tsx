import { useState } from "react"

type Props = {
  deviceTypes: { id: number; name: string }[]
  deviceModels: { id: number; device_type_id: number; name: string }[]

  addDeviceType: (name: string) => Promise<void>
  renameDeviceType: (id: number, newName: string) => Promise<void>
  deleteDeviceTypes: (ids: number[]) => Promise<void>

  addDeviceModel: (deviceTypeId: number, name: string) => Promise<void>
  renameDeviceModel: (id: number, newName: string) => Promise<void>
  deleteDeviceModels: (ids: number[]) => Promise<void>
}

export default function DeviceTypeSettingsModal({
  deviceTypes,
  deviceModels,
  addDeviceType,
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
  const handleAddType = () => {
    if (!newTypeName.trim()) return
    addDeviceType(newTypeName)
    setNewTypeName("")
  }

  const handleRenameType = () => {
    if (!selectedTypeId) return

    const type = deviceTypes.find(t => t.id === selectedTypeId)
    if (!type) return

    const name = prompt("新しい機種名", type.name)
    if (!name) return

    renameDeviceType(selectedTypeId, name)
  }

  const handleDeleteType = () => {
    if (!selectedTypeId) return
    if (!confirm("機種を削除しますか？（型式がある場合は削除できません）")) return

    deleteDeviceTypes([selectedTypeId])
  }

  // ===== deviceModel =====
  const filteredModels = deviceModels
    .filter(m => m.device_type_id === selectedTypeId)
    .sort((a, b) => a.name.localeCompare(b.name, "ja"))

  const toggleModel = (id: number) => {
    setCheckedModelIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleAddModel = () => {
    if (!selectedTypeId) {
      alert("機種を選択してください")
      return
    }

    if (!newModelName.trim()) return

    addDeviceModel(selectedTypeId, newModelName)
    setNewModelName("")
  }

  const handleDeleteModels = () => {
    deleteDeviceModels(checkedModelIds)
    setCheckedModelIds([])
  }

  const handleRenameModel = (model: { id: number; name: string }) => {
    const name = prompt("新しい型式名", model.name)
    if (!name) return

    renameDeviceModel(model.id, name)
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