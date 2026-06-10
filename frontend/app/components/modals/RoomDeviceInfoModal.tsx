"use client"

import { Device } from "../../types/deviceTypes"
import { createPortal } from "react-dom"

//page.tsxから
//stateレス化
type Props = {
  isOpen: boolean
  selectedRoomDevice: Device | null
  deviceTypes: any[]
  deviceModels: any[]
  onCancel: () => void
  wards: any[]
  rooms: any[]
  tasks: any[]                 // ← 追加
  maintenanceTypes: any[]      // ← 追加
  onCompleteTask: (taskId: number) => Promise<boolean>  // ← 追加
  renameManagementNumber:(id: number, value: string)=> Promise<boolean>
  renameSerialNumber:(id: number, value: string)=> Promise<boolean>
  renameNote:(id: number, value: string)=> Promise<boolean>
  renamePatientName:(roomId: number, value: string)=> Promise<boolean>
  toggleDeviceStandby:(
                        deviceId: number,
                        standby: boolean,
                      )=> Promise<boolean>
  renameRentalDates : (
                        deviceId: number,
                        rentalStartDate: string,
                        rentalEndDate: string
                      )=>Promise<boolean>
}

export default function RoomDeviceInfoModal({
  isOpen,
  selectedRoomDevice,
  deviceTypes,
  deviceModels,
  onCancel,
  wards,
  rooms,
  tasks,
  maintenanceTypes,
  onCompleteTask,
  renameManagementNumber,
  renameSerialNumber,
  renameNote,
  renamePatientName,
  toggleDeviceStandby,
  renameRentalDates
}: Props) {

if (!isOpen || !selectedRoomDevice) return null

// ===== selectedRoomDeviceから直接取得 =====

const managementNumber =
  selectedRoomDevice.managementNumber ?? ""

const serialNumber =
  selectedRoomDevice.serialNumber ?? ""

const note =
  selectedRoomDevice.note ?? ""

const rentalStartDate =
  selectedRoomDevice.rentalStartDate || ""

const rentalEndDate =
  selectedRoomDevice.rentalEndDate || ""

const standby =
  selectedRoomDevice.standby ?? false

const standbyStartedAt =
  selectedRoomDevice.standbyStartedAt || ""

const standbyFinishedAt =
  selectedRoomDevice.standbyFinishedAt || ""

// ===== room =====

const room = rooms.find(
  r => r.roomId === selectedRoomDevice.roomId
)

const patientName =
  room?.patientName ?? ""

// ===== 名前 =====

const typeName =
  deviceTypes.find(
    t => t.id === selectedRoomDevice.type
  )?.name ?? "不明"

const modelName =
  deviceModels.find(
    m => m.id === selectedRoomDevice.model
  )?.name ?? "不明"

const roomName =
  room?.roomName ?? "不明"

const wardName =
  wards.find(
    w => w.wardId === room?.wardId
  )?.wardName ?? "不明"  
    // 🔽 共通表示行
  const InfoRow = ({
                    label,
                    value,
                    onEdit
                    }: {
                          label: string
                          value: string
                          onEdit: () => void
                        }) => (
                                <div className="flex items-center justify-between py-2">
                                  <div>
                                    <span className="text-sm text-gray-500">{label}：</span>
                                    <span className="ml-2 font-medium">
                                      {value || "情報なし"}
                                    </span>
                                  </div>

                                  <button
                                    onClick={onEdit}
                                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                  >
                                    ✏
                                  </button>
                                </div>
                          )
  // 🔽 期限表示関数
  const getStatus = (due_at: string) => {
    const now = new Date()
    const diff = new Date(due_at).getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (days < 0) return { label: `期限切れ（${Math.abs(days)}日）`, color: "red" }
    if (days <= 2) return { label: `残り${days}日`, color: "yellow" }
    return { label: `残り${days}日`, color: "green" }
  }
  const isStandbyOverOneMonth = (() => {
    if (!standby || !standbyStartedAt) return false

    const start = new Date(standbyStartedAt)
    const limit = new Date(start)
    limit.setMonth(limit.getMonth() + 1)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    limit.setHours(0, 0, 0, 0)

    return today >= limit
  })()
  //スタンバイ開始解除の関数
  const handleToggleStandby = async () => {

    if (!selectedRoomDevice.id) return

    // ===== 解除 =====

    if (standby) {

      const success =
        await toggleDeviceStandby(
          selectedRoomDevice.id,
          false
        )

      if (!success) return

      return
    }

    // ===== 開始 =====

    const success =
      await toggleDeviceStandby(
        selectedRoomDevice.id,
        true
      )

    if (!success) return
  }  
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <button
          onClick={onCancel}
          className="
            relative
            top-3
            left-3
            text-gray-500
            hover:text-black
            text-xl
            font-bold
          "
        >
          ✕
        </button>
        {/* 🔽 タイトル */}
        <h2 className="text-xl font-bold text-center">
          病棟機器情報
        </h2>

        {/* 🔽 機種 + 型式 */}
        <div>
          <div className="text-lg font-bold">
            {typeName}　{modelName}　{selectedRoomDevice.assetType}

            {(selectedRoomDevice.assetType === "レンタル" ||
              selectedRoomDevice.assetType === "代替機") &&
              rentalEndDate && (() => {

                const today = new Date()

                const end = new Date(rentalEndDate)

                // 時刻ズレ防止
                today.setHours(0,0,0,0)
                end.setHours(0,0,0,0)

                const diff =
                  end.getTime() - today.getTime()

                const days =
                  Math.ceil(diff / (1000 * 60 * 60 * 24))

                // 超過
                if (days < 0) {
                  return (
                    <span className="ml-3 text-sm text-red-600 font-bold">
                      返却日超過
                    </span>
                  )
                }

                // 当日
                if (days === 0) {
                  return (
                    <span className="ml-3 text-sm text-red-600 font-bold">
                      本日返却
                    </span>
                  )
                }

                // 2日前以内
                if (days <= 2) {
                  return (
                    <span className="ml-3 text-sm text-red-600 font-bold">
                      返却まで{days}日
                    </span>
                  )
                }

                return null

              })()}
          </div>

          <div className="text-gray-600">
            {wardName}　{roomName}
          </div>
        </div>

        {/* 🔽 情報 */}
        <div className="border-t pt-2 space-y-1">

          {/* 患者 */}
          <InfoRow
            label="患者"
            value={patientName}
            onEdit={async () => {
              if (!selectedRoomDevice.roomId) return
              const val = prompt(
                "患者名を入力",
                patientName
              )
              if (val === null) return
              const success =
                await renamePatientName(
                  selectedRoomDevice.roomId,
                  val
                )
              if (!success) return
            }}
          />

          {/* 管理番号 */}
          <InfoRow
            label="管理番号"
            value={managementNumber}
            onEdit={async () => {
              if (!selectedRoomDevice.id) return
              const val = prompt(
                      "管理番号を入力",
                      managementNumber
                    )
              if (val === null) return
              const success =
                    await renameManagementNumber(
                      selectedRoomDevice.id,
                      val
                    )
              if (!success) return
            }}
          />
          {/* シリアル */}
          <InfoRow
            label="シリアル"
            value={serialNumber}
            onEdit={async () => {
              if (!selectedRoomDevice.id) return
              const val = prompt(
                "シリアル番号を入力",
                serialNumber
              )
              if (val === null) return
              const success =
                await renameSerialNumber(
                  selectedRoomDevice.id,
                  val
                )
              if (!success) return
            }}
          />
            {(selectedRoomDevice.assetType === "レンタル" ||
              selectedRoomDevice.assetType === "代替機") && (
              <>
          {/* 貸与開始日 */}
          <InfoRow
            label="貸与開始日"
            value={rentalStartDate}
            onEdit={async () => {
              if (!selectedRoomDevice.id) return
              const val = prompt(
                "貸与開始日を入力 (YYYY-MM-DD)",
                rentalStartDate
              )
              if (val === null) return
              const success =
                await renameRentalDates(
                  selectedRoomDevice.id,
                  val,
                  rentalEndDate
                )
              if (!success) return
            }}
          />
          {/* 返却日 */}
          <InfoRow
            label="返却日"
            value={rentalEndDate}
            onEdit={async () => {
              if (!selectedRoomDevice.id) return
              const val = prompt(
                "返却日を入力 (YYYY-MM-DD)",
                rentalEndDate
              )
              if (val === null) return
              const success =
                await renameRentalDates(
                  selectedRoomDevice.id,
                  rentalStartDate,
                  val
                )
              if (!success) return
            }}
          />
        </>
              
      )}

          {false && isStandbyOverOneMonth && (
            <div className="rounded border border-red-300 bg-red-50 p-2 text-sm font-bold text-red-700">
              スタンバイ開始から1か月経過しています。返却を検討してください。
            </div>
          )}

          

          {/* 備考 */}
          <InfoRow
            label="備考"
            value={note}
            onEdit={async () => {

              if (!selectedRoomDevice.id) return

              const val = prompt(
                "備考を入力",
                note
              )

              if (val === null) return

              const success =
                await renameNote(
                  selectedRoomDevice.id,
                  val
                )

              if (!success) return

            }} 
          />
        </div>
          <div className="border-t pt-4 mt-2 space-y-3">

            {standby && (
              <>
                <div>
                  <div className="font-bold">
                    スタンバイ
                  </div>
                </div>

                <div className="text-m text-gray-600">
                  待機開始日：{standbyStartedAt || "未設定"}
                </div>
              </>
            )}
            {isStandbyOverOneMonth && (
              <div className="rounded border border-red-300 bg-red-50 p-2 text-sm font-bold text-red-700">
                スタンバイ開始から1か月経過しています。返却を検討してください。
              </div>
            )}
          </div>

            {/* 🔽 メンテナンス */}
          <div className="border-t pt-4 mt-2">
            <div className="font-bold mb-2">メンテナンス</div>

            {tasks.length === 0 && (
              <div className="text-gray-500 text-sm">タスクなし</div>
            )}

            {tasks.map(task => {
              const type = maintenanceTypes.find(t => t.id === task.maintenance_type_id)
              const status = getStatus(task.due_at)

              return (
                <div
                  key={task.id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div>
                    <div className="font-medium">{type?.name}</div>
                    <div className="text-sm text-gray-500">
                      {status.label}
                    </div>
                    <div className="text-xs text-gray-400">
                      期限：{new Date(task.due_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>
                      {status.color === "red" && "🔴"}
                      {status.color === "yellow" && "🟡"}
                      {status.color === "green" && "🟢"}
                    </span>

                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                      onClick={async () => {
                        const success =
                          await onCompleteTask(
                            task.id
                          )
                        if (!success) return
                      }}  
                    >
                      実施
                    </button>
                  </div>
                </div>
              )
            })}
          </div>


        {/* 🔽 ボタン */}
        <div className="flex justify-end gap-2 pt-4 border-t">

          <button
            onClick={handleToggleStandby}
            className={`
              px-3 py-1 rounded text-sm font-bold
              ${
                standby
                  ? "bg-yellow-300 text-black hover:bg-yellow-400"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }
            `}
          >
            {standby ? "スタンバイ解除" : "スタンバイ"}
          </button>

        </div>      
      </div>
    </div>,
    document.body
  )
}
// 簡易スタイル
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}

const modalStyle: React.CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  width: 300
}
