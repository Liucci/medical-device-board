"use client"
import { useEffect, useMemo, useState } from "react"
import { Device } from "../../types/deviceTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { WardType } from "../../types/wardTypes"
import { RoomType } from "../../types/roomTypes"
import CommonModal from "../common/CommonModal"

type Props = {
  deviceList: Device[]
  isOpen: boolean
  onClose: () => void
  onSubmit: (roomId: number, patientName: string, samePatient: boolean) => void
  wards: WardType[]
  rooms: RoomType[]
  pendingDevice: Device | null
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
  initialWardId: number | null
}

export default function RoomToRoomModal({
  deviceList,
  isOpen,
  onClose,
  onSubmit,
  wards,
  rooms,
  pendingDevice,
  deviceTypes,
  deviceModels,
  initialWardId
}: Props) {
  const [targetWardId, setTargetWardId] = useState<number | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [patientName, setPatientName] = useState("")
  const currentRoom = rooms.find(r => r.id === pendingDevice?.roomId)
  const currentWard = wards.find(w => w.id === currentRoom?.wardId)
  const typeName = deviceTypes.find(t => t.id === pendingDevice?.type)?.name ?? "不明"
  const modelName = deviceModels.find(m => m.id === pendingDevice?.model)?.name ?? "不明"
  useEffect(() => {
    if (!isOpen) return
    setTargetWardId(initialWardId)
    setSelectedRoomId(null)
    setPatientName(currentRoom?.patientName ?? "")
  }, [isOpen, pendingDevice, currentRoom])
  
  const filteredRooms = useMemo(() => {
    return rooms.filter(r => r.wardId === targetWardId).sort((a, b) => a.name.localeCompare(b.name, "ja", { numeric: true }))
  }, [rooms, targetWardId])

  useEffect(() => {
    if (!selectedRoomId) return
    const room = rooms.find(r => r.id === selectedRoomId)
    if (patientName === "") {
      setPatientName(room?.patientName ?? "")
    }
  }, [selectedRoomId, rooms])
  const samePatient = patientName === (currentRoom?.patientName ?? "")
  const willResetTasks = !samePatient
  if (!isOpen) return null
  return (
    <CommonModal
      open={true}
      onClose={onClose}
      title="機器移動"
      maxWidth="max-w-5xl"
    >
      <div className="w-full rounded-xl bg-gray-200 p-5">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-6">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-4 text-lg font-semibold text-gray-800">
                現在
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-gray-600">病棟</div>
                  <div className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700">
                    {currentWard?.name ?? "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600">病室</div>
                  <div className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700">
                    {currentRoom?.name ?? "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600">患者名</div>
                  <div className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700">
                    {currentRoom?.patientName || "未入力"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600">機種</div>
                  <div className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700">
                    {typeName}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600">型式</div>
                  <div className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700">
                    {modelName}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-full items-center justify-center pt-20 text-5xl font-bold text-gray-300">
              →
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-4 text-lg font-semibold text-gray-800">
                移動先
              </div>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 text-xs font-medium text-gray-600">
                    病棟
                  </div>
                  <select
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={targetWardId ?? ""}
                    onChange={(e) => {
                      setTargetWardId(Number(e.target.value))
                      setSelectedRoomId(null)
                    }}
                  >
                    <option value="">病棟を選択</option>
                    {wards.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-gray-600">
                    病室
                  </div>
                  <select
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-400"
                    value={selectedRoomId ?? ""}
                    onChange={(e) => {
                      const roomId = Number(e.target.value)
                      const existsDevice = deviceList.some(d => d.roomId === roomId && d.id !== pendingDevice?.id)
                      if (existsDevice) {
                        const ok = window.confirm("既に患者が存在します。\n移動先の患者に使用しますか？")
                        if (!ok) return
                      }
                      setSelectedRoomId(roomId)
                    }}
                    disabled={!targetWardId}
                  >
                    <option value="">病室を選択</option>
                    {filteredRooms.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-gray-600">
                    患者名
                  </div>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="患者名を入力"
                  />
                </div>
                {willResetTasks && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-500">
                    患者名変更時は既存の
                    メンテナンスタスクを
                    キャンセルし、
                    新規タスクを作成します
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-5">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
            >
              キャンセル
            </button>
            <button
              onClick={() => {
                if (!selectedRoomId) return
                onSubmit(selectedRoomId, patientName, samePatient)
              }}
              disabled={!selectedRoomId}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              確定
            </button>
          </div>
        </div>
      </div>
    </CommonModal>
  )
}