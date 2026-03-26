"use client"

import { useState } from "react"

type Props = {
  onClose: () => void
  onCreate: (roomNumber: string, patientName: string) => void
  rooms: string[]
}

export default function RoomAssignModal({ onClose, onCreate ,rooms}: Props) {
    console.log("rooms:", rooms)
  const [roomNumber, setRoomNumber] = useState("")
  const [patientName, setPatientName] = useState("")

  const handleSubmit = () => {
    if (!roomNumber) return
    onCreate(roomNumber, patientName)
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded w-80">

        <h2 className="font-bold mb-4">配置情報入力</h2>

        <select
        className="border p-2 w-full mb-2"
        value={roomNumber}
        onChange={(e)=>setRoomNumber(e.target.value)}
        >
        <option value="">部屋選択</option>

        {rooms.map((r)=>(
            <option key={r} value={r}>
            {r}
            </option>
        ))}
        </select>
        <input
          className="border p-2 w-full"
          placeholder="患者名"
          value={patientName}
          onChange={(e)=>setPatientName(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-300 px-3 py-1 rounded">
            キャンセル
          </button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-3 py-1 rounded">
            作成
          </button>
        </div>

      </div>
    </div>
  )
}