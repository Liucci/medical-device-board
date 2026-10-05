import { useState } from "react"
import { WardType } from "../../types/wardTypes"
import { RoomType } from "../../types/roomTypes"
import { createWardTransaction } from "../../api/transactions/wards/createWardTransaction"
import { deleteWardTransaction } from "../../api/transactions/wards/deleteWardTransaction"
import { updateWardTransaction } from "../../api/transactions/wards/updateWardTransaction"
import { createRoomTransaction } from "../../api/transactions/rooms/createRoomTransaction"
import { updateRoomTransaction } from "../../api/transactions/rooms/updateRoomTransaction"
import { deleteRoomsTransaction } from "../../api/transactions/rooms/deleteRoomsTransaction"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../common/LoadingOverlay"
import useInputModal from "../../components/common/useInputModal"
import { Edit2, Plus, Trash2 } from "lucide-react"

type Props = {
  wards: WardType[]
  setWards: React.Dispatch<React.SetStateAction<any[]>>
  rooms: RoomType[]
  setRooms: React.Dispatch<React.SetStateAction<any[]>>
}

export default function WardAreaSettingsModal({ wards, setWards, rooms, setRooms }: Props) {
  const [selectedWardId, setSelectedWardId] = useState<number | null>(null)
  const [newWardName, setNewWardName] = useState("")
  const [newRoomName, setNewRoomName] = useState("")
  const [checkedRoomIds, setCheckedRoomIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const inputModal = useInputModal()

  // ===== Ward =====
  const handleAddWard = async () => {
    if (!newWardName.trim()) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        await createWardTransaction({
          ward: { name: newWardName },
          setWards,
          onClose: () => setNewWardName("")
        })
      }
    })
  }

  const handleUpdateWard = () => {
    if (!selectedWardId) return
    const ward = wards.find(w => w.id === selectedWardId)
    if (!ward) return
    inputModal.openInputModal({
      title: "新しい病棟名",
      label: "病棟名",
      value: ward.name,
      type: "text",
      buttonPattern: "save_cancel",
      onConfirm: async (name: string) => {
        if (!name) return
        await executeWithErrorAndLoading({
          setLoading,
          action: async () => {
            await updateWardTransaction({
              ward: {
                id: selectedWardId,
                name
              },
              setWards
            })
          }
        })
      }
    })
  }

  const handleDeleteWard = async () => {
    if (!selectedWardId) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        await deleteWardTransaction({
          ward: { id: selectedWardId },
          setWards,
          setRooms
        })
      }
    })
    setSelectedWardId(null)
  }

  // ===== Room =====
  const filteredRooms = rooms.filter(r => r.wardId === selectedWardId).sort((a, b) => a.name.localeCompare(b.name, "ja"))
  const toggleRoom = (roomId: number) => {
    setCheckedRoomIds(prev => prev.includes(roomId) ? prev.filter(i => i !== roomId) : [...prev, roomId])
  }

  const handleAddRoom = async () => {
    if (!selectedWardId) {
      inputModal.openInputModal({
        title: "確認",
        message: "病棟を選択してください",
        type: "confirm",
        buttonPattern: "ok_only",
        icon: "warning"
      })
      return
    }
    if (!newRoomName.trim()) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        await createRoomTransaction({
          room: {
            wardId: selectedWardId,
            name: newRoomName
          },
          setRooms,
          onClose: () => setNewRoomName("")
        })
      }
    })
  }

  const handleDeleteRooms = async () => {
    if (checkedRoomIds.length === 0) {
      inputModal.openInputModal({
        title: "確認",
        message: "部屋を選択してください",
        type: "confirm",
        buttonPattern: "ok_only",
        icon: "warning"
      })
      return
    }
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        await deleteRoomsTransaction({
          rooms: { ids: checkedRoomIds },
          setRooms
        })
      }
    })
    setCheckedRoomIds([])
  }

  const handleRenameRoom = (room: { id: number; name: string }) => {
    inputModal.openInputModal({
      title: "新しい部屋名",
      label: "部屋名",
      value: room.name,
      type: "text",
      buttonPattern: "save_cancel",
      onConfirm: async (name: string) => {
        if (!name) return
        await executeWithErrorAndLoading({
          setLoading,
          action: async () => {
            await updateRoomTransaction({
              room: {
                id: room.id,
                name
              },
              setRooms
            })
          }
        })
      }
    })
  }

  return (
    <>
      <div className="w-full rounded-2xl bg-slate-50 p-3 sm:p-4">
        <div className="grid min-h-0 grid-cols-1 gap-4 lg:grid-cols-2">
          {/* 左：病棟 */}
          <div className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="shrink-0 border-b border-slate-100 px-4 py-3 sm:px-5">
              <div className="text-xs font-bold tracking-wide text-slate-700">病棟</div>
              <p className="mt-1 text-[11px] text-slate-500">病棟を選択して、名前の変更や削除を行います</p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-500">病棟を選択</label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedWardId ?? ""}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setSelectedWardId(val || null)
                      setCheckedRoomIds([])
                    }}
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">選択してください</option>
                    {wards.map((ward) => (
                      <option key={ward.id} value={ward.id}>{ward.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleUpdateWard}
                    disabled={!selectedWardId}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="病棟名を編集"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {selectedWardId && (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleDeleteWard}
                    className="flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    病棟を削除
                  </button>
                </div>
              )}

              {!selectedWardId && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3">
                    <div className="text-xs font-bold tracking-wide text-slate-700">新しい病棟を追加</div>
                    <p className="mt-1 text-[11px] text-slate-500">新しい病棟名を入力してください</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                    <div className="min-w-0 flex-1">
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">病棟名</label>
                      <input
                        value={newWardName}
                        onChange={(e) => setNewWardName(e.target.value)}
                        placeholder="例：ICU"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddWard}
                      className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-teal-700 px-4 text-xs font-bold text-white transition-colors hover:bg-teal-800"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      追加
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右：部屋 */}
          <div className="flex min-h-0 max-h-[600px] flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="shrink-0 border-b border-slate-100 px-4 py-3 sm:px-5">
              <div className="text-xs font-bold tracking-wide text-slate-700">部屋</div>
              <p className="mt-1 text-[11px] text-slate-500">選択した病棟の部屋を管理します</p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              <div className="mb-4">
                <div className="text-xs font-medium text-slate-500">選択中の病棟</div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  {selectedWardId ? wards.find((ward) => ward.id === selectedWardId)?.name : "病棟を選択してください"}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div>
                    <div className="text-xs font-bold tracking-wide text-slate-700">登録されている部屋</div>
                    {selectedWardId && (
                      <div className="mt-1 text-[11px] text-slate-500">{filteredRooms.length} 件</div>
                    )}
                  </div>
                  {checkedRoomIds.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteRooms}
                      className="flex h-8 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      選択削除
                    </button>
                  )}
                </div>

                <div className="px-3 py-1">
                  {!selectedWardId ? (
                    <div className="py-10 text-center text-xs text-slate-400">病棟を選択してください</div>
                  ) : filteredRooms.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-400">登録されている部屋はありません</div>
                  ) : (
                    <div>
                      {filteredRooms.map((room) => (
                        <div
                          key={room.id}
                          className="flex min-h-12 items-center gap-3 border-b border-slate-100 px-2 py-2 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={checkedRoomIds.includes(room.id)}
                            onChange={() => toggleRoom(room.id)}
                            className="h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-teal-700 focus:ring-teal-200"
                          />
                          <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900">{room.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRenameRoom(room)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            aria-label={`${room.name}を編集`}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3">
                  <div className="text-xs font-bold tracking-wide text-slate-700">新しい部屋を追加</div>
                  <p className="mt-1 text-[11px] text-slate-500">選択中の病棟に部屋を追加します</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder={selectedWardId ? "例：101号室" : "先に病棟を選択してください"}
                    disabled={!selectedWardId}
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddRoom}
                    disabled={!selectedWardId}
                    className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-teal-700 px-4 text-xs font-bold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    追加
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoadingOverlay loading={loading} />
      {inputModal.ModalElement}
    </>
  )
}