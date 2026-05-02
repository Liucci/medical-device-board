import { useState } from "react"

type Props = {
  wards: { id: number; name: string }[]
  rooms: { id: number; roomName: string; wardId: number }[]

  addWard: (name: string) => Promise<void>
  renameWard: (id: number, newName: string) => Promise<void>
  deleteWards: (ids: number[]) => Promise<void>

  addRoom: (wardId: number, name: string) => Promise<void>
  renameRoom: (id: number, newName: string) => Promise<void>
  deleteRooms: (ids: number[]) => Promise<void>
}

export default function WardAreaSettingsModal({
  wards,
  rooms,
  addWard,
  renameWard,
  deleteWards,
  addRoom,
  renameRoom,
  deleteRooms
}: Props) {

  const [selectedWardId, setSelectedWardId] = useState<number | null>(null)
  const [newWardName, setNewWardName] = useState("")
  const [newRoomName, setNewRoomName] = useState("")
  const [checkedRoomIds, setCheckedRoomIds] = useState<number[]>([])

  // ===== Ward =====
  //ward追加
  const handleAddWard = () => {
    if (!newWardName.trim()) return
    addWard(newWardName)
    setNewWardName("")
  }
  // ward名前変更（prompt使用の仮実装）
  const handleRenameWard = () => {
    // selectedWardIdがnullのときは何もしない
    if (!selectedWardId) return
    // selectedWardIdに対応する病棟を見つける
    const ward = wards.find(w => w.id === selectedWardId)
    if (!ward) return
    // promptで新しい名前を入力してもらう
    const name = prompt("新しい病棟名", ward.name)
    if (!name) return
    // renameWard関数を呼び出す
    renameWard(selectedWardId, name)
  }
  // ward削除
  const handleDeleteWard = () => {
    if (!selectedWardId) return
    if (!confirm("病棟を削除すると部屋も削除されます。よろしいですか？")) return
    // deleteWards関数を呼び出す
    deleteWards([selectedWardId])
  }

  // ===== Room =====
  // 選択中の病棟に属する部屋だけ表示
  const filteredRooms = rooms
    .filter(r => r.wardId === selectedWardId)
    .sort((a, b) => a.roomName.localeCompare(b.roomName, "ja"))
  // チェック切り替え
  const toggleRoom = (id: number) => {
    setCheckedRoomIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }
  // 部屋追加
  const handleAddRoom = () => {
    if (!selectedWardId) {
      alert("病棟を選択してください")
      return
    }

    if (!newRoomName.trim()) return

    addRoom(selectedWardId, newRoomName)
    setNewRoomName("")
  }
  // 部屋削除
  const handleDeleteRooms = () => {
    deleteRooms(checkedRoomIds)
    setCheckedRoomIds([])
  }
  // 部屋名前変更（prompt使用の仮実装）
  const handleRenameRoom = (room: { id: number; roomName: string }) => {
    const name = prompt("新しい部屋名", room.roomName)
    if (!name) return

    renameRoom(room.id, name)
  }

  return (
    <div className="space-y-6">

      {/* ===== Ward操作 ===== */}
      <div className="space-y-2">

            <div className="flex gap-2">
            <select
                value={selectedWardId ?? ""}
                onChange={(e) => {
                const val = Number(e.target.value)
                setSelectedWardId(val || null)
                setCheckedRoomIds([]) // 🔥 ward変更でリセット
                }}
                className="border px-2 py-1 rounded"
            >
                <option value="">病棟選択</option>
                {wards.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
                ))}
            </select>

            <button onClick={handleRenameWard} className="px-2 bg-gray-200 rounded">✏</button>
            <button onClick={handleDeleteWard} className="px-2 bg-red-500 text-white rounded">削除</button>
            </div>

            {/* ===== Ward追加（未選択時のみ表示） */}
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

      {/* ===== Room操作 ===== */}
      <div className="space-y-2">

        <div className="border rounded p-2 max-h-60 overflow-y-auto">
          {filteredRooms.map(room => (
            <div key={room.id} className="flex items-center gap-2 py-1">

              <input
                type="checkbox"
                checked={checkedRoomIds.includes(room.id)}
                onChange={() => toggleRoom(room.id)}
              />

              <span className="flex-1">{room.roomName}</span>

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