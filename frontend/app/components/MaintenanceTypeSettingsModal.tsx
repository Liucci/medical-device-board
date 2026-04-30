"use client"

import { useState } from "react"

type Props = {
  maintenanceTypes: any[]
  deviceTypes: any[]
  deviceModels: any[]

  addMaintenanceType: (data: {
                              name: string
                              deviceTypeId: number
                              deviceModelId: number | null
                              intervalDays: number
                            }) => Promise<void>

  renameMaintenanceType: (
                          id: number,
                          data: {
                            name: string
                            intervalDays: number
                          }
                        ) => Promise<void>

  deleteMaintenanceTypes: (ids: number[]) => Promise<void>
}

export default function MaintenanceTypeSettingsModal({
  maintenanceTypes,
  deviceTypes,
  deviceModels,
  addMaintenanceType,
  renameMaintenanceType,
  deleteMaintenanceTypes
}: Props) {

  const [selectedTypeId, setSelectedTypeId] = useState<number | "">("")
  const [selectedModelId, setSelectedModelId] = useState<number | "">("")

  const [name, setName] = useState("")
  const [intervalDays, setIntervalDays] = useState(30)

  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // 🔽 型式候補
  const filteredModels = deviceModels.filter(
    m => m.device_type_id === selectedTypeId
  )

  // 🔽 追加
  const handleAdd = async () => {
    if (selectedTypeId === "") {
      alert("機種を選択してください")
      return
    }

    if (!name.trim()) {
      alert("メンテ名を入力してください")
      return
    }

    await addMaintenanceType({
      name,
      deviceTypeId: selectedTypeId,
      deviceModelId:
        selectedModelId === ""
          ? null
          : selectedModelId,
      intervalDays
    })

    setName("")
    setIntervalDays(30)
    setSelectedModelId("")
  }

  // 🔽 チェック切替
  const toggleCheck = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(v => v !== id)
        : [...prev, id]
    )
  }

  // 🔽 削除
  const handleDelete = async () => {
    if (selectedIds.length === 0) return

    const ok = window.confirm(
      "選択したメンテ種別を削除しますか？"
    )

    if (!ok) return

    await deleteMaintenanceTypes(selectedIds)

    setSelectedIds([])
  }

  return (
    <div className="space-y-6">

      {/* 🔽 追加フォーム */}
      <div className="border rounded-lg p-4 space-y-3">

        <div className="font-bold text-lg">
          メンテナンス追加
        </div>

        {/* 機種 */}
        <div>
          <div className="text-sm mb-1">
            機種
          </div>

          <select
            value={selectedTypeId}
            onChange={e => {
              const value = e.target.value

              setSelectedTypeId(
                value === ""
                  ? ""
                  : Number(value)
              )

              setSelectedModelId("")
            }}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">
              選択してください
            </option>

            {deviceTypes.map(type => (
              <option
                key={type.id}
                value={type.id}
              >
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* 型式 */}
        <div>
          <div className="text-sm mb-1">
            型式
          </div>

          <select
            value={selectedModelId}
            onChange={e => {
              const value = e.target.value

              setSelectedModelId(
                value === ""
                  ? ""
                  : Number(value)
              )
            }}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">
              共通
            </option>

            {filteredModels.map(model => (
              <option
                key={model.id}
                value={model.id}
              >
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* メンテ名 */}
        <div>
          <div className="text-sm mb-1">
            メンテ名
          </div>

          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="使用前点検"
          />
        </div>

        {/* 間隔 */}
        <div>
          <div className="text-sm mb-1">
            間隔日数
          </div>

          <input
            type="number"
            value={intervalDays}
            onChange={e =>
              setIntervalDays(Number(e.target.value))
            }
            className="w-full border rounded px-2 py-1"
          />
        </div>

        {/* 追加ボタン */}
        <button
          onClick={handleAdd}
          className="w-full bg-blue-500 text-white rounded py-2"
        >
          追加
        </button>
      </div>

      {/* 🔽 一覧 */}
      <div className="border rounded-lg p-4">

        <div className="flex justify-between items-center mb-4">

          <div className="font-bold text-lg">
            メンテナンス一覧
          </div>

          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            削除
          </button>
        </div>

        {/* 🔽 一覧 */}
        <div className="space-y-2 max-h-[250px] overflow-y-auto">

          {[...maintenanceTypes]
            .sort((a, b) => {

              const aType =
                deviceTypes.find(t => t.id === a.device_type_id)
                  ?.name ?? ""

              const bType =
                deviceTypes.find(t => t.id === b.device_type_id)
                  ?.name ?? ""

              // ① 機種名
              const typeCompare = aType.localeCompare(bType, "ja")

              if (typeCompare !== 0) return typeCompare

              const aModel =
                a.device_model_id
                  ? deviceModels.find(
                      m => m.id === a.device_model_id
                    )?.name ?? ""
                  : "共通"

              const bModel =
                b.device_model_id
                  ? deviceModels.find(
                      m => m.id === b.device_model_id
                    )?.name ?? ""
                  : "共通"

              // ② 型式名
              const modelCompare = aModel.localeCompare(bModel, "ja")

              if (modelCompare !== 0) return modelCompare

              // ③ メンテ名
              return a.name.localeCompare(b.name, "ja")
            })
            .map(mt => {

              const typeName =
                deviceTypes.find(
                  t => t.id === mt.device_type_id
                )?.name ?? "不明"

              const modelName =
                mt.device_model_id
                  ? deviceModels.find(
                      m => m.id === mt.device_model_id
                    )?.name
                  : "共通"

              return (
                <div
                  key={mt.id}
                  className="border rounded p-3 flex justify-between items-center"
                >

                {/* 左 */}
                <div className="flex items-start gap-3">

                  <input
                    type="checkbox"
                    checked={selectedIds.includes(mt.id)}
                    onChange={() => toggleCheck(mt.id)}
                  />

                  <div>

                    <div className="font-medium">
                      {mt.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {typeName}
                      {" / "}
                      {modelName}
                    </div>

                    <div className="text-sm text-gray-500">
                      {mt.interval_days}日
                    </div>
                  </div>
                </div>

                {/* 右 */}
                <button
                  onClick={async () => {

                    const newName = prompt(
                      "メンテ名",
                      mt.name
                    )

                    if (newName === null) return

                    const newInterval = prompt(
                      "間隔日数",
                      mt.interval_days
                    )

                    if (newInterval === null) return

                    await renameMaintenanceType(
                      mt.id,
                      {
                        name: newName,
                        intervalDays: Number(newInterval)
                      }
                    )
                  }}
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  ✏
                </button>
              </div>
            )
          })}

          {maintenanceTypes.length === 0 && (
            <div className="text-gray-500 text-sm">
              メンテ種別なし
            </div>
          )}
        </div>
      </div>
    </div>
  )
}