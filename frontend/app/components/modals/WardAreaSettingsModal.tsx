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

  // ===== Ward =====

  const handleAddWard = async () => {
    await createWardTransaction({
                                   ward: {
                                           name: newWardName
                                         },
                                   setWards,
                                   onClose: () => setNewWardName("")
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

    await updateWardTransaction({
                                   ward: {
                                           id: selectedWardId,
                                           name
                                         },
                                   setWards
                                 })
  }

  const handleDeleteWard = async () => {
    if (!selectedWardId) {return}

    await deleteWardTransaction({
                                   ward: {
                                           id: selectedWardId
                                         },
                                   setWards,
                                   setRooms
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

    await createRoomTransaction({
                                   room: {
                                           wardId: selectedWardId,
                                           name: newRoomName
                                         },
                                   setRooms,
                                   onClose: () => setNewRoomName("")
                                 })
  }

  const handleDeleteRooms = async () => {
    if (checkedRoomIds.length === 0) {
      alert("部屋を選択してください")
      return
    }

    await deleteRoomsTransaction({
                                    rooms: {
                                             ids: checkedRoomIds
                                           },
                                    setRooms
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

    await updateRoomTransaction({
                                   room: {
                                           id: room.id,
                                           name
                                         },
                                   setRooms
                                 })
  }

  return (
    <div className="space-y-6">

      <div className="space-y-2">

        <div className="flex gap-2">

          <select
            value={selectedWardId ?? ""}
            onChange={(e) => {
              const val = Number(e.target.value)
              setSelectedWardId(val || null)
              setCheckedRoomIds([])
            }}
            className="border px-2 py-1 rounded"
          >
            <option value="">
              病棟選択
            </option>

            {wards.map(w => (
              <option
                key={w.id}
                value={w.id}
              >
                {w.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleUpdateWard}
            className="px-2 bg-gray-200 rounded"
          >
            ✏
          </button>

          <button
            onClick={handleDeleteWard}
            className="px-2 bg-red-500 text-white rounded"
          >
            削除
          </button>

        </div>

        {!selectedWardId && (
          <div className="flex gap-2">

            <input
              value={newWardName}
              onChange={(e) => setNewWardName(e.target.value)}
              placeholder="新規病棟名"
              className="border px-2 py-1 flex-1 rounded"
            />

            <button
              onClick={handleAddWard}
              className="px-3 bg-blue-500 text-white rounded"
            >
              追加
            </button>

          </div>
        )}

      </div>

      <div className="space-y-2">

        <div className="border rounded p-2 max-h-60 overflow-y-auto">

          {filteredRooms.map(room => (

            <div
              key={room.id}
              className="flex items-center gap-2 py-1"
            >

              <input
                type="checkbox"
                checked={checkedRoomIds.includes(room.id)}
                onChange={() => toggleRoom(room.id)}
              />

              <span className="flex-1">
                {room.name}
              </span>

              <button
                onClick={() => handleRenameRoom(room)}
                className="px-2 bg-gray-200 rounded"
              >
                ✏
              </button>

            </div>

          ))}

        </div>

        <div className="flex gap-2">

          <input
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="新規部屋名"
            className="border px-2 py-1 flex-1 rounded"
          />

          <button
            onClick={handleAddRoom}
            className="px-3 bg-blue-500 text-white rounded"
          >
            追加
          </button>

        </div>

        <button
          onClick={handleDeleteRooms}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          選択削除
        </button>

      </div>

    </div>
  )
}