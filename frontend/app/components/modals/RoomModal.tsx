"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import type { Device } from "../../types/deviceTypes"
import type { WardType } from "../../types/wardTypes"
import type { RoomType } from "../../types/roomTypes"

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
  pendingDevice,
}: Props) {
  console.log("RoomModal")
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [patientName, setPatientName] = useState("")

  useEffect(() => {
    if (!isOpen) return
    if (pendingDevice?.roomId) {
      setSelectedRoomId(pendingDevice.roomId)
      const r = rooms.find((room) => room.id === pendingDevice.roomId)
      setPatientName(r?.patientName ?? "")
    } else {
      setSelectedRoomId(null)
      setPatientName("")
    }
  }, [isOpen, pendingDevice, rooms])

  useEffect(() => {
    if (!selectedRoomId) return
    const r = rooms.find((room) => room.id === selectedRoomId)
    if (r) setPatientName(r.patientName ?? "")
  }, [selectedRoomId, rooms])

  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = originalOverflow }
  }, [isOpen])

  if (!isOpen || wardId === null) return null

  const ward = wards.find((w) => w.id === wardId)
  const filteredRooms = rooms.filter((r) => r.wardId === wardId).sort((a, b) => a.name.localeCompare(b.name, "ja", { numeric: true }))

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div className="flex h-[45vh] w-full flex-col overflow-hidden rounded-t-2xl border-t border-slate-300 bg-slate-50 shadow-2xl transition-transform duration-200 animate-in slide-in-from-bottom sm:h-auto sm:max-h-[90vh] sm:max-w-md sm:rounded-2xl sm:border sm:border-slate-300 sm:animate-none">
        <div className="bg-slate-900 px-4 py-2.5 text-white sm:px-5 sm:py-3">
          <div className="flex justify-center pb-1.5 sm:hidden">
            <div className="h-1 w-10 rounded-full bg-slate-600" />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold sm:text-base">病室登録</h2>
              <p className="mt-0.5 text-[11px] text-slate-300">機器を配置する病室と患者名を設定します</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white sm:h-8 sm:w-8"
              title="閉じる"
              aria-label="閉じる"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto space-y-3.5 p-4 sm:space-y-4 sm:p-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">病棟</label>
            <div className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-bold text-slate-800">
              {ward?.name ?? "－"}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">病室</label>
            <select
              value={selectedRoomId ?? ""}
              onChange={(e) => setSelectedRoomId(e.target.value === "" ? null : Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            >
              <option value="">病室を選択してください</option>
              {filteredRooms.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">患者名</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="患者名を入力"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>

        <div className="flex w-full gap-2 border-t border-slate-200 bg-white p-3 sm:justify-end sm:gap-3 sm:px-5 sm:py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 sm:h-9 sm:w-24 sm:flex-none sm:text-sm"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={() => {
              if (!selectedRoomId) return
              onSubmit(selectedRoomId, patientName)
            }}
            disabled={!selectedRoomId}
            className="flex h-10 flex-1 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white shadow-sm transition-all hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-24 sm:flex-none sm:text-sm"
          >
            決定
          </button>
        </div>
      </div>
    </div>
  )
}