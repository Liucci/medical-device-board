"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronUp, ArrowDown, X, AlertTriangle } from "lucide-react"
import type { Device } from "../../types/deviceTypes"
import type { DeviceTypeType } from "../../types/deviceTypeTypes"
import type { DeviceModelType } from "../../types/deviceModelTypes"
import type { WardType } from "../../types/wardTypes"
import type { RoomType } from "../../types/roomTypes"
import ConfirmModal from "../common/ConfirmModal"
import useConfirmModal from "../common/useConfirmModal"

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
  initialWardId,
}: Props) {
  console.log("RoomToRoomModal")
  const confirmModal = useConfirmModal()
  const [targetWardId, setTargetWardId] = useState<number | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [patientName, setPatientName] = useState("")
  const [isCurrentDetailOpen, setIsCurrentDetailOpen] = useState(false)

  const currentRoom = rooms.find((r) => r.id === pendingDevice?.roomId)
  const currentWard = wards.find((w) => w.id === currentRoom?.wardId)
  const typeName = deviceTypes.find((t) => t.id === pendingDevice?.type)?.name ?? "不明"
  const modelName = deviceModels.find((m) => m.id === pendingDevice?.model)?.name ?? "不明"

  useEffect(() => {
    if (!isOpen) return
    setTargetWardId(initialWardId)
    setSelectedRoomId(null)
    setPatientName(currentRoom?.patientName ?? "")
    setIsCurrentDetailOpen(false)
  }, [isOpen, pendingDevice, currentRoom, initialWardId])

  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = originalOverflow }
  }, [isOpen])

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => r.wardId === targetWardId).sort((a, b) => a.name.localeCompare(b.name, "ja", { numeric: true }))
  }, [rooms, targetWardId])

  useEffect(() => {
    if (!selectedRoomId) return
    const r = rooms.find((room) => room.id === selectedRoomId)
    if (patientName === "") setPatientName(r?.patientName ?? "")
  }, [selectedRoomId, rooms, patientName])

  const samePatient = patientName === (currentRoom?.patientName ?? "")
  const willResetTasks = !samePatient

  const handleRoomChange = async (roomId: number) => {
    const existsDevice = deviceList.some((d) => d.roomId === roomId && d.id !== pendingDevice?.id)
    if (existsDevice) {
      const ok = await confirmModal.confirm({
        title: "患者の重複確認",
        message: "移動先の部屋には既に他の機器が配置されています。\n移動先の患者に使用しますか？",
        buttonPattern: "yes_no",
        icon: "question",
      })
      if (!ok) return
    }
    setSelectedRoomId(roomId)
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
      >
        <div className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border-t border-slate-300 bg-slate-50 shadow-2xl transition-transform duration-200 animate-in slide-in-from-bottom sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl sm:border sm:border-slate-300 sm:animate-none">
          <div className="bg-slate-900 px-4 py-3 text-white sm:px-5 sm:py-3.5">
            <div className="flex justify-center pb-1.5 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-slate-600" />
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-bold sm:text-base">機器移動</h2>
                <p className="mt-0.5 text-[11px] text-slate-300">機器の移動先病棟・病室および患者名を設定します</p>
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

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start">
              {/* 移動元（現在）：スマホ時は矢印ボタンで詳細開閉 */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                <div
                  onClick={() => setIsCurrentDetailOpen((prev) => !prev)}
                  className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-2.5 cursor-pointer sm:cursor-default"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-700">現在の配置（移動元）</span>
                    <span className="text-[11px] font-bold text-slate-800 ml-2 sm:hidden">
                      {currentWard?.name ?? "-"} / {currentRoom?.name ?? "-"}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="現在の配置詳細を開閉"
                    className="flex h-6 w-6 items-center justify-center rounded text-slate-400 sm:hidden"
                  >
                    {isCurrentDetailOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                <div className={`p-4 space-y-2.5 text-xs ${isCurrentDetailOpen ? "block" : "hidden sm:block"}`}>
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-100 pb-1.5">
                    <span className="font-medium text-slate-500">機器名</span>
                    <span className="font-bold text-slate-900">{typeName}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-100 pb-1.5">
                    <span className="font-medium text-slate-500">型式</span>
                    <span className="font-bold text-slate-900">{modelName}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-100 pb-1.5">
                    <span className="font-medium text-slate-500">現在の病棟</span>
                    <span className="font-bold text-slate-900">{currentWard?.name ?? "-"}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-100 pb-1.5">
                    <span className="font-medium text-slate-500">現在の病室</span>
                    <span className="font-bold text-slate-900">{currentRoom?.name ?? "-"}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-medium text-slate-500">現在の患者名</span>
                    <span className="font-bold text-teal-800">{currentRoom?.patientName || "未登録"}</span>
                  </div>
                </div>
              </div>

              {/* スマホ用移動コネクター */}
              <div className="flex justify-center sm:hidden -my-1">
                <div className="flex items-center gap-1 rounded-full bg-slate-200 px-3 py-0.5 text-[10px] font-bold text-slate-600">
                  <ArrowDown className="h-3 w-3" />
                  <span>移動先を指定</span>
                </div>
              </div>

              {/* 移動先の設定フォーム */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3.5">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-700">移動先の設定</span>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">移動先病棟</label>
                  <select
                    value={targetWardId ?? ""}
                    onChange={(e) => {
                      setTargetWardId(e.target.value === "" ? null : Number(e.target.value))
                      setSelectedRoomId(null)
                    }}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">病棟を選択してください</option>
                    {wards.map((w) => (<option key={w.id} value={w.id}>{w.name}</option>))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">移動先病室</label>
                  <select
                    value={selectedRoomId ?? ""}
                    disabled={!targetWardId}
                    onChange={(e) => {
                      if (e.target.value === "") { setSelectedRoomId(null); return }
                      handleRoomChange(Number(e.target.value))
                    }}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="">
                      {!targetWardId ? "先に病棟を選択してください" : "病室を選択してください"}
                    </option>
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

                {willResetTasks && (
                  <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 leading-relaxed">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                    <span>患者名変更に伴い、既存のメンテナンスタスクをキャンセルし新規タスクを作成します。</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* フッター：スマホ時は横幅100%の2分割親指ボタン、PCは右寄せ */}
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
                onSubmit(selectedRoomId, patientName, samePatient)
              }}
              disabled={!selectedRoomId}
              className="flex h-10 flex-1 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white shadow-sm transition-all hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-24 sm:flex-none sm:text-sm"
            >
              確定
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmModal.isOpen}
        onClose={confirmModal.closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        subMessage={confirmModal.subMessage}
        icon={confirmModal.icon}
        buttonPattern={confirmModal.buttonPattern}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        confirmVariant={confirmModal.confirmVariant}
      />
    </>
  )
}