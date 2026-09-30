import { useState } from "react"
import { useEffect } from "react"
import { Device } from "../../types/deviceTypes"
import { WardType } from "../../types/wardTypes"
import { RoomType } from "../../types/roomTypes"
import CommonModal from "../common/CommonModal"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (roomId: number, patientName: string) => void
  wardId: number | null
  wards: WardType[]
  rooms: RoomType[]
  pendingDevice: Device | null
}

export default function RoomModal({
  isOpen,
  onClose,
  onSubmit,
  wardId,
  wards,
  rooms,
  pendingDevice
}: Props) {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [patientName, setPatientName] = useState("")
  useEffect(() => {
    if (!isOpen) return
    if (pendingDevice?.roomId) {
      setSelectedRoomId(pendingDevice.roomId)
      const room = rooms.find(r => r.id === pendingDevice.roomId)
      setPatientName(room?.patientName ?? "")
    } else {
      setSelectedRoomId(null)
      setPatientName("")
    }
  }, [isOpen, pendingDevice, rooms])
  useEffect(() => {
    if (!selectedRoomId) return
    const selectedRoom = rooms.find(r => r.id === selectedRoomId)
    if (selectedRoom) {
      setPatientName(selectedRoom.patientName ?? "")
    }
  }, [selectedRoomId, rooms])
  if (!isOpen || wardId === null) return null
  const ward = wards.find(w => w.id === wardId)
  const filteredRooms = rooms.filter(r => r.wardId === wardId).sort((a, b) => a.name.localeCompare(b.name, "ja"))
  return (
    <CommonModal
      open={true}
      onClose={onClose}
      title="病室登録"
      maxWidth="max-w-[600px]"
    >
      <div className="w-full rounded-xl bg-slate-50 p-4 sm:p-5">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="space-y-5 p-4 sm:p-5">

            {/* ===================================================== */}
            {/* 病室情報 */}
            {/* ===================================================== */}
            <div>
              <h3 className="text-xs font-bold tracking-wide text-slate-700">
                病室情報
              </h3>

              <p className="mt-1 text-[11px] text-slate-500">
                機器を配置する病室と患者名を入力してください。
              </p>
            </div>

            {/* ===================================================== */}
            {/* 病棟 */}
            {/* ===================================================== */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500">
                病棟
              </label>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700">
                {ward?.name ?? ""}
              </div>
            </div>

            {/* ===================================================== */}
            {/* 病室 */}
            {/* ===================================================== */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500">
                病室
              </label>

              <select
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  bg-slate-50
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-700
                  outline-none
                  transition-colors
                  focus:border-teal-500
                  focus:ring-2
                  focus:ring-teal-100
                "
                value={selectedRoomId ?? ""}
                onChange={(e) =>
                  setSelectedRoomId(
                    Number(e.target.value)
                  )
                }
              >
                <option value="">
                  病室を選択
                </option>

                {filteredRooms.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ===================================================== */}
            {/* 患者名 */}
            {/* ===================================================== */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500">
                患者名
              </label>

              <input
                type="text"
                value={patientName}
                onChange={(e) =>
                  setPatientName(e.target.value)
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  bg-slate-50
                  px-3
                  py-2.5
                  text-sm
                  text-slate-700
                  outline-none
                  transition-colors
                  placeholder:text-slate-400
                  focus:border-teal-500
                  focus:ring-2
                  focus:ring-teal-100
                "
                placeholder="患者名を入力"
              />
            </div>

            {/* ===================================================== */}
            {/* ボタン */}
            {/* ===================================================== */}
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="
                  h-10
                  rounded-lg
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  text-xs
                  font-bold
                  text-slate-700
                  transition-colors
                  hover:bg-slate-100
                "
              >
                キャンセル
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!selectedRoomId) return
                  onSubmit(
                    selectedRoomId,
                    patientName
                  )
                }}
                disabled={!selectedRoomId}
                className="
                  h-10
                  rounded-lg
                  bg-teal-700
                  px-5
                  text-xs
                  font-bold
                  text-white
                  transition-colors
                  hover:bg-teal-800
                  disabled:cursor-not-allowed
                  disabled:bg-slate-300
                "
              >
                決定
              </button>
            </div>

          </div>
        </div>
      </div>
    </CommonModal>
  )
  
}