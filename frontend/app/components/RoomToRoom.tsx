"use client"

import { createPortal } from "react-dom"
import { useEffect, useMemo, useState } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (
    roomId: number,
    patientName: string,
    samePatient: boolean
  ) => void
  wards: any[]
  rooms: any[]

  pendingDevice: any | null

  deviceTypes: any[]
  deviceModels: any[]
}

export default function RoomToRoomModal({
  isOpen,
  onClose,
  onSubmit,
  wards,
  rooms,
  pendingDevice,
  deviceTypes,
  deviceModels
}: Props) {

  const [targetWardId, setTargetWardId] =
    useState<number | null>(null)

  const [selectedRoomId, setSelectedRoomId] =
    useState<number | null>(null)

  const [patientName, setPatientName] =
    useState("")

  // ===== 現在room =====

  const currentRoom =
    rooms.find(
      r => r.id === pendingDevice?.roomId
    )

  // ===== 現在ward =====

  const currentWard =
    wards.find(
      w => w.id === currentRoom?.wardId
    )

  // ===== 機種 =====

  const typeName =
    deviceTypes.find(
      t => t.id === pendingDevice?.type
    )?.name ?? "不明"

  // ===== 型式 =====

  const modelName =
    deviceModels.find(
      m => m.id === pendingDevice?.model
    )?.name ?? "不明"

  // ===== 初期化 =====

  useEffect(() => {

    if (!isOpen) return

    setTargetWardId(
      currentRoom?.wardId ?? null
    )

    setSelectedRoomId(
      pendingDevice?.roomId ?? null
    )

    setPatientName(
      currentRoom?.patientName ?? ""
    )

  }, [
    isOpen,
    pendingDevice,
    currentRoom
  ])

  // ===== 移動先room一覧 =====

  const filteredRooms =
    useMemo(() => {

      return rooms
        .filter(
          r => r.wardId === targetWardId
        )
        .sort((a, b) =>
          a.roomName.localeCompare(
            b.roomName,
            "ja",
            { numeric: true }
          )
        )

    }, [rooms, targetWardId])

  // ===== room変更時 =====

  useEffect(() => {

    if (!selectedRoomId) return

    const room =
      rooms.find(
        r => r.id === selectedRoomId
      )

    // 初回患者名表示
    if (
      patientName === ""
    ) {

      setPatientName(
        room?.patientName ?? ""
      )
    }

  }, [
    selectedRoomId,
    rooms
  ])

  // ===== 同一患者判定 =====

  const samePatient =
    patientName ===
    (currentRoom?.patientName ?? "")

  // ===== メッセージ =====

  const willResetTasks =
    !samePatient

  if (!isOpen) return null

  return createPortal(

    <div
      className="
        fixed inset-0
        bg-black/30
        flex items-center justify-center
        z-50
      "
    >

      <div
        className="
          bg-white
          rounded-xl
          shadow-xl
          w-full
          max-w-5xl
          p-6
        "
      >

        {/* title */}

        <h2
          className="
            text-2xl
            font-bold
            mb-6
            text-center
          "
        >
          機器移動
        </h2>

        {/* main */}

        <div
          className="
            grid
            grid-cols-[1fr_auto_1fr]
            gap-6
            items-start
          "
        >

          {/* ===== 現在情報 ===== */}

          <div
            className="
              border
              rounded-xl
              p-4
              bg-gray-50
            "
          >

            <div
              className="
                font-bold
                text-lg
                mb-4
              "
            >
              現在
            </div>

            <div className="space-y-3">

              <div>
                <div className="text-xs text-gray-500">
                  病棟
                </div>

                <div className="font-bold">
                  {currentWard?.name ?? "-"}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">
                  病室
                </div>

                <div className="font-bold">
                  {currentRoom?.roomName ?? "-"}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">
                  患者名
                </div>

                <div className="font-bold">
                  {currentRoom?.patientName || "未入力"}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">
                  機種
                </div>

                <div className="font-bold">
                  {typeName}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">
                  型式
                </div>

                <div className="font-bold">
                  {modelName}
                </div>
              </div>
            </div>
          </div>

          {/* ===== arrow ===== */}

          <div
            className="
              flex items-center justify-center
              text-5xl
              font-bold
              text-gray-400
              h-full
              pt-20
            "
          >
            →
          </div>

          {/* ===== 移動先 ===== */}

          <div
            className="
              border
              rounded-xl
              p-4
            "
          >

            <div
              className="
                font-bold
                text-lg
                mb-4
              "
            >
              移動先
            </div>

            <div className="space-y-4">

              {/* ward */}

              <div>

                <div className="text-xs text-gray-500 mb-1">
                  病棟
                </div>

                <select
                  className="
                    border
                    rounded
                    p-2
                    w-full
                  "

                  value={targetWardId ?? ""}

                  onChange={(e) => {

                    setTargetWardId(
                      Number(e.target.value)
                    )

                    setSelectedRoomId(null)
                  }}
                >

                  <option value="">
                    選択してください
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
              </div>

              {/* room */}

              <div>

                <div className="text-xs text-gray-500 mb-1">
                  病室
                </div>

                <select
                  className="
                    border
                    rounded
                    p-2
                    w-full
                  "

                  value={selectedRoomId ?? ""}

                  onChange={(e) =>
                    setSelectedRoomId(
                      Number(e.target.value)
                    )
                  }
                >

                  <option value="">
                    選択してください
                  </option>

                  {filteredRooms.map(r => (

                    <option
                      key={r.id}
                      value={r.id}
                    >
                      {r.roomName}
                    </option>
                  ))}
                </select>
              </div>

              {/* patient */}

              <div>

                <div className="text-xs text-gray-500 mb-1">
                  患者名
                </div>

                <input
                  type="text"

                  value={patientName}

                  onChange={(e) =>
                    setPatientName(
                      e.target.value
                    )
                  }

                  className="
                    border
                    rounded
                    p-2
                    w-full
                  "

                  placeholder="患者名を入力"
                />
              </div>

              {/* task message */}

              {willResetTasks && (

                <div
                  className="
                    text-sm
                    text-red-500
                    border
                    border-red-200
                    bg-red-50
                    rounded-lg
                    p-3
                  "
                >
                  患者名変更時は既存の
                  メンテナンスタスクを
                  キャンセルし、
                  新規タスクを作成します
                </div>
              )}
            </div>
          </div>
        </div>

        {/* buttons */}

        <div
          className="
            flex justify-end gap-3
            mt-8
          "
        >

          <button
            onClick={onClose}

            className="
              px-4 py-2
              border
              rounded
            "
          >
            キャンセル
          </button>

          <button
            onClick={() => {

              if (!selectedRoomId) return

              onSubmit(
                selectedRoomId,
                patientName,
                samePatient
              )
            }}

            className="
              bg-blue-500
              text-white
              px-5 py-2
              rounded
            "
          >
            確定
          </button>
        </div>
      </div>
    </div>,

    document.body
  )
}