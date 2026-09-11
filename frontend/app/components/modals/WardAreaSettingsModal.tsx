import { useState } from "react"

import { Device } from "../../types/deviceTypes"
import { StockAreaType } from "../../types/stockTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { WardType } from "../../types/wardTypes"
import {CurrentUser  } from "../../types/userTypes"
import { RoomType } from "../../types/roomTypes"
import {MaintenanceType } from "../../types/maintenanceTypeTypes"

import { createWardTransaction } from "../../api/transactions/wards/createWardTransaction"
import { deleteWardTransaction } from "../../api/transactions/wards/deleteWardTransaction"
import { updateWardTransaction } from "../../api/transactions/wards/updateWardTransaction"

import { createRoomTransaction } from "../../api/transactions/rooms/createRoomTransaction"
import { updateRoomTransaction } from "../../api/transactions/rooms/updateRoomTransaction"
import { deleteRoomsTransaction } from "../../api/transactions/rooms/deleteRoomsTransaction"
import { executeWithLoading } from "../common/executeWithLoading"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"
import {LoadingOverlay} from "../common/LoadingOverlay"


type Props = {
  wards:WardType[]
  setWards: React.Dispatch<React.SetStateAction<any[]>>
  rooms: RoomType[]
  setRooms: React.Dispatch<React.SetStateAction<any[]>>
}

export default function WardAreaSettingsModal({
  wards,
  setWards,
  rooms,
  setRooms,
}: Props) {

  const [selectedWardId, setSelectedWardId] = useState<number | null>(null)
  const [newWardName, setNewWardName] = useState("")
  const [newRoomName, setNewRoomName] = useState("")
  const [checkedRoomIds, setCheckedRoomIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

// ===== Ward =====

  const handleAddWard = async () => {
    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {

            await createWardTransaction({
                                          ward: {
                                                  name: newWardName
                                                },
                                          setWards,
                                          onClose: () => setNewWardName("")
                                        })
        }
    })
  
  }

  const handleUpdateWard = async () => {
    if (!selectedWardId) {return}

    const ward =
                  wards.find(
                              w => w.id === selectedWardId
                            )

    if (!ward) {return}

    const name =
                  prompt(
                          "新しい病棟名",
                          ward.name
                        )

    if (!name) {return}
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

  const handleDeleteWard = async () => {
    if (!selectedWardId) {return}
    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {

            await deleteWardTransaction({
                                          ward: {
                                                  id: selectedWardId
                                                },
                                          setWards,
                                          setRooms
                                        })
        }
    })
  setSelectedWardId(null)
  }

  // ===== Room =====

  const filteredRooms =
    rooms
      .filter(
                r => r.wardId === selectedWardId
             )
      .sort(
              (a,b) =>
                a.name.localeCompare(
                                      b.name,
                                      "ja"
                                    )
           )

  const toggleRoom = (
                       roomId: number
                     ) => {
    setCheckedRoomIds(
                        prev =>
                          prev.includes(roomId)
                            ? prev.filter(i => i !== roomId)
                            : [...prev, roomId]
                     )
  }

  const handleAddRoom = async () => {
    if (!selectedWardId) {
      alert("病棟を選択してください")
      return
    }
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
      alert("部屋を選択してください")
      return
    }
    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {

            await deleteRoomsTransaction({
                                            rooms: {
                                                    ids: checkedRoomIds
                                                  },
                                            setRooms
                                          })
              }
    })
  }

  const handleRenameRoom = async (
                                    room:{id:number,name:string}
                                  ) => {

    const name =
                  prompt(
                          "新しい部屋名",
                          room.name
                        )

    if (!name) {return}
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

  return (
    <>
      <div className="w-full rounded-2xl bg-gray-200 p-5">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ===================================================== */}
          {/* 左：病棟 */}
          {/* ===================================================== */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                病棟
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                病棟を選択して、名前の変更や削除を行います
              </p>
            </div>


            {/* ================================================= */}
            {/* 病棟選択 */}
            {/* ================================================= */}
            <div className="space-y-2">

              <label className="block text-xs font-medium text-gray-600">
                病棟を選択
              </label>

              <div className="flex items-center gap-2">

                <select
                  value={selectedWardId ?? ""}
                  onChange={(e) => {
                    const val = Number(e.target.value)

                    setSelectedWardId(val || null)
                    setCheckedRoomIds([])
                  }}
                  className="
                    min-w-0
                    flex-1
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-gray-700
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                >
                  <option value="">
                    選択してください
                  </option>

                  {wards.map((ward) => (
                    <option
                      key={ward.id}
                      value={ward.id}
                    >
                      {ward.name}
                    </option>
                  ))}
                </select>


                {/* 名前変更 */}
                <button
                  onClick={handleUpdateWard}
                  disabled={!selectedWardId}
                  className="
                    shrink-0
                    rounded-lg
                    bg-gray-100
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-600
                    transition
                    hover:bg-gray-200
                    hover:text-gray-800
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  ✏
                </button>

              </div>

            </div>


            {/* ================================================= */}
            {/* 病棟削除 */}
            {/* ================================================= */}
            {selectedWardId && (
              <div className="mt-6">

                <button
                  onClick={handleDeleteWard}
                  className="
                    rounded-lg
                    bg-red-50
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-red-600
                    transition
                    hover:bg-red-100
                  "
                >
                  病棟を削除
                </button>

              </div>
            )}


            {/* ================================================= */}
            {/* 新しい病棟を追加 */}
            {/* ================================================= */}
            {!selectedWardId && (
              <div className="mt-8">

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800">
                    新しい病棟を追加
                  </h4>

                  <p className="mt-1 text-xs text-gray-500">
                    新しい病棟名を入力してください
                  </p>
                </div>

                <div className="flex items-end gap-3">

                  <div className="min-w-0 flex-1">

                    <label className="mb-2 block text-xs font-medium text-gray-600">
                      病棟名
                    </label>

                    <input
                      value={newWardName}
                      onChange={(e) =>
                        setNewWardName(e.target.value)
                      }
                      placeholder="例：ICU"
                      className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        bg-white
                        px-3
                        py-2.5
                        text-sm
                        text-gray-700
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    />

                  </div>


                  <button
                    onClick={handleAddWard}
                    className="
                      shrink-0
                      rounded-lg
                      bg-blue-500
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-blue-600
                    "
                  >
                    追加
                  </button>

                </div>

              </div>
            )}

          </div>


          {/* ===================================================== */}
          {/* 右：部屋 */}
          {/* ===================================================== */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-6">

              <h3 className="text-lg font-semibold text-gray-800">
                部屋
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                選択した病棟の部屋を管理します
              </p>

            </div>


            {/* ================================================= */}
            {/* 選択中の病棟 */}
            {/* ================================================= */}
            <div className="mb-5">

              <div className="text-xs font-medium text-gray-600">
                選択中の病棟
              </div>

              <div className="mt-1 text-base font-semibold text-gray-800">

                {selectedWardId
                  ? wards.find(
                      (ward) => ward.id === selectedWardId
                    )?.name
                  : "病棟を選択してください"}

              </div>

            </div>


            {/* ================================================= */}
            {/* 部屋一覧ヘッダー */}
            {/* ================================================= */}
            <div className="mb-3 flex items-center justify-between">

              <div>

                <div className="text-sm font-semibold text-gray-800">
                  登録されている部屋
                </div>

                {selectedWardId && (
                  <div className="mt-1 text-xs text-gray-500">
                    {filteredRooms.length} 件
                  </div>
                )}

              </div>


              {checkedRoomIds.length > 0 && (
                <button
                  onClick={handleDeleteRooms}
                  className="
                    rounded-lg
                    bg-red-50
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-red-600
                    transition
                    hover:bg-red-100
                  "
                >
                  選択削除
                </button>
              )}

            </div>


            {/* ================================================= */}
            {/* 部屋一覧 */}
            {/* ================================================= */}
            <div className="max-h-[420px] overflow-y-auto">

              {!selectedWardId ? (

                <div className="py-12 text-center text-sm text-gray-400">
                  病棟を選択してください
                </div>

              ) : filteredRooms.length === 0 ? (

                <div className="py-12 text-center text-sm text-gray-400">
                  登録されている部屋はありません
                </div>

              ) : (

                <div>

                  {filteredRooms.map((room) => (

                    <div
                      key={room.id}
                      className="
                        flex
                        items-center
                        gap-3
                        border-b
                        border-gray-100
                        py-3
                        last:border-b-0
                        hover:bg-gray-50
                      "
                    >

                      {/* チェックボックス */}
                      <input
                        type="checkbox"
                        checked={checkedRoomIds.includes(room.id)}
                        onChange={() => toggleRoom(room.id)}
                        className="
                          h-4
                          w-4
                          cursor-pointer
                          rounded
                          border-gray-300
                          text-blue-500
                          focus:ring-blue-400
                        "
                      />


                      {/* 部屋名 */}
                      <span className="min-w-0 flex-1 truncate text-sm text-gray-800">
                        {room.name}
                      </span>


                      {/* 編集 */}
                      <button
                        onClick={() => handleRenameRoom(room)}
                        className="
                          shrink-0
                          rounded-lg
                          bg-gray-100
                          px-3
                          py-1.5
                          text-sm
                          font-medium
                          text-gray-600
                          transition
                          hover:bg-gray-200
                          hover:text-gray-800
                        "
                      >
                        ✏
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </div>


            {/* ================================================= */}
            {/* 部屋追加 */}
            {/* ================================================= */}
            <div className="mt-8">

              <div className="mb-4">

                <h4 className="text-sm font-semibold text-gray-800">
                  新しい部屋を追加
                </h4>

                <p className="mt-1 text-xs text-gray-500">
                  選択中の病棟に部屋を追加します
                </p>

              </div>


              <div className="flex gap-3">

                <input
                  value={newRoomName}
                  onChange={(e) =>
                    setNewRoomName(e.target.value)
                  }
                  placeholder={
                    selectedWardId
                      ? "例：101号室"
                      : "先に病棟を選択してください"
                  }
                  disabled={!selectedWardId}
                  className="
                    min-w-0
                    flex-1
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-gray-700
                    outline-none
                    transition
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:text-gray-400
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

                <button
                  onClick={handleAddRoom}
                  disabled={!selectedWardId}
                  className="
                    shrink-0
                    rounded-lg
                    bg-blue-500
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-600
                    disabled:cursor-not-allowed
                    disabled:bg-gray-300
                  "
                >
                  追加
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>


      {/* ===================================================== */}
      {/* Loading */}
      {/* ===================================================== */}
      <LoadingOverlay loading={loading} />

    </>
  )

}